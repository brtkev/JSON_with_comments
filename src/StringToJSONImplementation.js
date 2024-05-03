
function getJSONStringAsArray(tree, string) {
    let cursor = tree.cursor(), level = 0
    const array = []
    do {
        if( cursor.name ==="⚠" ) return undefined;

        // //guardar nombre de la propiedad actual
        if (cursor.name === "PropertyName") {
            let prop = string.slice(cursor.from, cursor.to);
            prop = prop.slice(1,-1);
            array.push({
                type: 'prop',
                name: prop,
                level: level,
                iterable: ''
            })
        }

        // //guardar valor de la propiedad actual 
        if (["String", "Number", "True", "False", "Null"].includes(cursor.name)) {
            let value = string.slice(cursor.from, cursor.to);
            if(cursor.name === "String") value = value.slice(1,-1);
            
            array.push({
                type: 'value',
                name: value,
                level: level,
                iterable: '',
                valueType: cursor.name
            })

        }

        // subir nivel y agregar iterable al ultimo item del array
        if (["Object", "Array"].includes(cursor.name)) {

            if (array[array.length - 1]) {
                array[array.length - 1].iterable = cursor.name;
                level++;
            }
        }

        // bajar nivel
        if (["]", "}"].includes(cursor.name)) {
            level--;
        }

    } while (cursor.next())

    return array;
}

function getValue(array = [], currentIndex = 0){
    const item = array[currentIndex];
    if( item.type === 'value'){
        //"String", "Number", "True", "False", "Null"

        switch (item.valueType) {
            case 'String':
                return item.name;
                break;
            case "Number":
                return Number(item.name);
                break;
            case "True":
                return true;
                break;
            case "False":
                return false;
                break;
            case "Null":
                return null;
                break;
        }
    }
}

function getProperty(array = [], currentIndex = 0) {
    const currentItem = array[currentIndex], nextItem = array[currentIndex + 1];
    const obj = {}

    if (currentItem.type === 'prop' && currentItem.iterable === 'Object') {
        
        return getObject(array, currentIndex);
    }
    else if (currentItem.type === 'prop' && currentItem.iterable === 'Array') {

        return getArray(array, currentIndex);
    }
    else if (currentItem.type === 'prop' && nextItem.type === 'value') {
        
        obj[currentItem.name] = getValue(array, currentIndex + 1);
        return [obj, currentIndex + 2]
    }
}

function getObject(array = [], currentIndex = 0) {

    const currentItem = array[currentIndex];
    if (currentItem.type === 'prop' && currentItem.iterable === 'Object') {
        const IndexOfNextObject = getIndexOfNextObject(array, currentIndex), acum = {};
        let i;
        for (i = currentIndex + 1; i < IndexOfNextObject;) {
            const [prop, newI] = getProperty(array, i);

            Object.assign(acum, prop);
            i = newI;
        }
        const obj = {}
        obj[currentItem.name] = acum;
        return [obj, i];
    }
}

function getArray(array = [], currentIndex) {
    const currentItem = array[currentIndex], obj = {};
    if (currentItem.type === 'prop' && currentItem.iterable === 'Array') {
        let i = currentIndex, iterable = [];
        const IndexOfNextObject = getIndexOfNextObject(array, currentIndex);

        for (i = i + 1; i < IndexOfNextObject;) {

            if (array[i].type === 'value') {
                iterable.push(array[i].name);
                i++
            } else {
                const [prop, newI] = getProperty(array, i);
                iterable.push(prop);
                i = newI;
            }
        }
        obj[currentItem.name] = iterable
        return [obj, i];
    }
}

function getIndexOfNextObject(array = [], currentIndex = 0) {
    let i;
    for (i = currentIndex + 1; i < array.length; i++) {
        if (array[i].level <= array[currentIndex].level) break;
    }
    return i;
}

function getJSONFromArray(array = []) {
    let i = 0, obj = {};
    do {
        const [item, newI] = getProperty(array, i);
        Object.assign(obj, item);
        i = newI
    } while (i < array.length);
    return obj;
}
export {
    getJSONStringAsArray,
    getJSONFromArray
}