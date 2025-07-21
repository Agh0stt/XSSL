const fs = require("fs");
const readline = require("readline");
const { execSync } = require("child_process");

let vars = {};
let funcs = {};
let output = [];

function evalExpr(expr, local = {}) {
  expr = expr.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
  expr = expr.replace(/\$(\w+)/g, (_, v) => local[v] ?? vars[v] ?? "");
  try {
    return Function(...Object.keys(local), ...Object.keys(vars), `return ${expr}`)(...Object.values(local), ...Object.values(vars));
  } catch {
    return expr;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function interpolate(str, local = {}) {
  return str
    .replace(/\$(\w+)/g, (_, v) => local[v] ?? vars[v] ?? "")
    .replace(/\$\{([^}]+)\}/g, (_, expr) => evalExpr(expr, local));
}

async function parse(lines, local = {}) {
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    if (!line || line.startsWith("//")) continue;

    if (line.startsWith("print ")) {
      let parts = line.slice(6).split("+").map(p => p.trim());
      let result = parts.map(p => {
        if (p.startsWith('"') && p.endsWith('"')) return p.slice(1, -1);
        return evalExpr(p, local);
      }).join("");
      console.log(result);
    }

    else if (/^\w+\s*=/.test(line)) {
      const [name, ...rest] = line.split("=");
      vars[name.trim()] = evalExpr(rest.join("=").trim(), local);
    }

    else if (line.startsWith("sleep ")) {
      const ms = parseInt(evalExpr(line.slice(6), local));
      await sleep(ms);
    }

    else if (line.startsWith("func ")) {
      const match = line.match(/^func\s+(\w+)\((.*?)\)/);
      if (match) {
        const [, name, paramStr] = match;
        const params = paramStr.split(/\s+/).filter(Boolean);
        const body = [];
        i++;
        while (i < lines.length && lines[i].trim() !== "end") body.push(lines[i++]);
        funcs[name] = { params, body };
      }
    }

    else if (line.startsWith("return ")) {
      return evalExpr(line.slice(7), local);
    }

    else if (/^\w+\(.*\)$/.test(line)) {
      const [, name, argsRaw] = line.match(/^(\w+)\((.*)\)$/) || [];
      const fn = funcs[name];
      if (!fn) {
        if (fs.existsSync(`.pkg/${name}.xssl`)) {
          const args = argsRaw.split(/\s+/).map(a => a.replace(/^"|"$/g, ""));
          const content = fs.readFileSync(`.pkg/${name}.xssl`, "utf-8").split("\n");
          const argMap = {};
          args.forEach((v, i) => argMap[`$${i+1}`] = v);
          await parse(content, argMap);
          continue;
        } else {
          console.log(" Function not found:", name);
          continue;
        }
      }
      const args = argsRaw.split(/\s+/).map(a => evalExpr(a, local));
      const scoped = {};
      fn.params.forEach((p, idx) => scoped[p] = args[idx]);
      const result = await parse(fn.body, scoped);
      if (result !== undefined) vars["_"] = result;
    }

    else if (line.startsWith("cd ")) {
      try { process.chdir(line.slice(3).trim()); }
      catch { console.log("Directory not found"); }
    }

    else if (line === "ls") {
      fs.readdirSync(".").forEach(f => console.log(f));
    }

    else if (line === "pwd") {
      console.log(process.cwd());
    }

    else if (line.startsWith("mkdir ")) {
      fs.mkdirSync(line.slice(6).trim(), { recursive: true });
    }

    else if (line.startsWith("rmdir ")) {
      fs.rmdirSync(line.slice(6).trim(), { recursive: true });
    }

    else if (line.startsWith("rm ")) {
      fs.unlinkSync(line.slice(3).trim());
    }

    else if (line.startsWith("touch ")) {
      fs.writeFileSync(line.slice(6).trim(), "");
    }

    else if (line.startsWith("echo ")) {
      console.log(interpolate(line.slice(5), local));
    }

    else if (line.startsWith("clear")) {
      console.clear();
    }

    else if (line.startsWith("get pkg ")) {
  const name = line.split(" ")[2];
  try {
    execSync(`bash scripts/getpkg.sh ${name}`, { stdio: "inherit" });
  } catch {
    console.log(" Failed to run get. Please Check your Inyernet connections.");
  }
}
    else {
      // Do nothing / ignore unknown
    }
  }
}

function runRepl() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const prompt = () => rl.question("xssl> ", async line => {
    await parse([line]);
    prompt();
  });
  prompt();
}

if (process.argv[2] === "--repl") {
  runRepl();
} else if (process.argv[2]) {
  const file = fs.readFileSync(process.argv[2], "utf-8").split("\n");
  parse(file);
} else {
  console.log("Usage: node index.js <file> OR --repl");
}
