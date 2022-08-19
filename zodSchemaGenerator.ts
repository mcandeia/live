import { generate } from "ts-to-zod";
import { join } from "https://deno.land/std@0.152.0/path/mod.ts";

const [inputFile, outputFile] = Deno.args;
const dir = Deno.cwd();

if (!inputFile || !outputFile) {
  console.error("Missing input or output files");
  Deno.exit();
}

const absoluteInputFile = join(dir, inputFile);
let sourceText = "";
try {
  sourceText = await Deno.readTextFile(absoluteInputFile);
} catch (e) {
  console.error("Error trying to read inputFile \n ", absoluteInputFile);
  console.error(e);
  Deno.exit();
}

const generateOptions = {
  sourceText,
};

const {
  errors,
  // transformedSourceText,
  getZodSchemasFile,
  // getIntegrationTestFile,
  // hasCircularDependencies,
} = generate(generateOptions);

// console.log(
// "Errors",
// errors,
// "\ntransformedSourceText:\n",
// transformedSourceText,
// "\ngetZodSchemasFile:\n",
// getZodSchemasFile,
// "\nhasCircularDependencies:\n",
// hasCircularDependencies,
// );

if (errors.length !== 0) {
  console.error("Found Errors: \n", errors.join("\n"));
}

const zodSchemasOutputText = getZodSchemasFile(absoluteInputFile);

// Replace the node import style to deno
const zodSchemaOutputForDeno = zodSchemasOutputText.replace(
  '"zod"',
  '"https://deno.land/x/zod/mod.ts"',
);

// console.log("\nzodSchemaFile:\n", zodSchemaOutputForDeno);

try {
  await Deno.writeTextFile(join(dir, outputFile), zodSchemaOutputForDeno);
} catch (e) {
  console.error(`Error writing on file "${outputFile}".`);
  console.error(e);
  Deno.exit();
}

console.log("Success!!! Open the output file: ", outputFile);
