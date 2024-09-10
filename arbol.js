function parseExpression(expression) {
    // Define los operadores válidos
    let operators = ['+', '-', '*', '/'];
    // Stack para manejar el balanceo de paréntesis
    let stack = [];
    // Variables para guardar la posición y el operador encontrado más recientemente
    let lastOpIndex = -1;
    let lastOp = '';
    
    // Recorre la expresión carácter por carácter
    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        // Si encuentra un paréntesis de apertura, lo agrega al stack
        if (char === '(') {
            stack.push(i);
        // Si encuentra un paréntesis de cierre, saca el último paréntesis de apertura del stack
        } else if (char === ')') {
            stack.pop();
        // Si encuentra un operador fuera de los paréntesis
        } else if (operators.includes(char) && stack.length === 0) {
            // Guarda el índice y el operador
            lastOpIndex = i;
            lastOp = char;
        }
    }

    // Si no se encuentra operador fuera de los paréntesis y la expresión está entre paréntesis
    if (lastOpIndex === -1 && expression[0] === '(' && expression[expression.length - 1] === ')') {
        // Llama recursivamente a la función quitando los paréntesis externos
        return parseExpression(expression.slice(1, -1).trim());
    }

    // Si se encontró un operador fuera de paréntesis
    if (lastOpIndex !== -1) {
        // Divide la expresión en partes izquierda y derecha
        let left = expression.slice(0, lastOpIndex).trim();
        let right = expression.slice(lastOpIndex + 1).trim();
        
        // Retorna un objeto que representa el nodo actual con sus hijos
        return {
            operator: lastOp,
            left: parseExpression(left),
            right: parseExpression(right)
        };
    } else {
        // Si es una expresión simple (sin operadores externos), retorna el valor directo
        return expression.trim();
    }
}

function createNode(value) {
    // Crea un nuevo elemento div para representar un nodo del árbol
    let node = document.createElement('div');
    node.className = 'node'; // Le asigna la clase CSS 'node'
    node.textContent = value; // Establece el texto del nodo con el valor proporcionado
    return node; // Retorna el nodo creado
}

function buildTree(node, container) {
    // Si el nodo es una hoja (es decir, es un string), crea y agrega el nodo hoja
    if (typeof node === 'string') {
        let leafNode = createNode(node);
        container.appendChild(leafNode);
        return;
    }

    // Crea un nodo para el operador (nodo raíz)
    let rootNode = createNode(node.operator);
    container.appendChild(rootNode);

    // Crea una línea que conecta el nodo raíz con sus hijos
    let line = document.createElement('div');
    line.className = 'line';
    container.appendChild(line);

    // Contenedor para los nodos hijo, con estilo flexbox para alinear los hijos
    let leftRightContainer = document.createElement('div');
    leftRightContainer.style.display = 'flex';
    leftRightContainer.style.justifyContent = 'space-between';

    // Contenedores para los nodos hijos izquierdo y derecho
    let leftContainer = document.createElement('div');
    let rightContainer = document.createElement('div');

    leftContainer.className = 'child-container';
    rightContainer.className = 'child-container';

    // Agrega los contenedores de los hijos al contenedor flexbox
    leftRightContainer.appendChild(leftContainer);
    leftRightContainer.appendChild(rightContainer);

    // Agrega el contenedor flexbox al contenedor principal
    container.appendChild(leftRightContainer);

    // Llama recursivamente para construir los subárboles izquierdo y derecho
    buildTree(node.left, leftContainer);
    buildTree(node.right, rightContainer);
}

// Agrega un evento de click al botón de generar el árbol
document.getElementById('generate-btn').addEventListener('click', () => {
    // Obtiene la expresión ingresada por el usuario
    let expression = document.getElementById('expression-input').value;
    // Parsea la expresión y genera la estructura del árbol
    let parsedExpression = parseExpression(expression);
    // Obtiene el contenedor del árbol
    let treeContainer = document.getElementById('tree-container');
    treeContainer.innerHTML = ''; // Limpia el contenido anterior del árbol
    // Construye y muestra el árbol en el contenedor
    buildTree(parsedExpression, treeContainer);
});
