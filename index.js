import { parser } from "./dist/index.js"
import { getJSONFromArray, getJSONStringAsArray } from './src/StringToJSONImplementation.js'
import fs from "node:fs";

fs.readFile('./src/example.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    const cadenaJSONConComentarios = data;
    const tree = parser.parse(cadenaJSONConComentarios);
    console.log("\n--- --- JSON tree as string --- ---\n", tree.toString())
    const array = getJSONStringAsArray(tree, cadenaJSONConComentarios);
    if (!array) console.log("\nel archivo json tiene errores. arreglelos he intente de nuevo.\n");

    if (array) {

        console.log("--- --- JSON as Array --- ---");
        console.table(array)

        const json = getJSONFromArray(array);
        console.log("\n--- --- final result --- ---\n", json);

        console.log("\n--- --- car properties --- ---\n", json['car']['properties']);
    }
});



