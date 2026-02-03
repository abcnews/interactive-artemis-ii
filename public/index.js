console.log("Loading module script...");
const script = document.createElement("script");
script.type = "module";
script.src = "http://localhost:5173/src/main.ts";
document.body.appendChild(script);