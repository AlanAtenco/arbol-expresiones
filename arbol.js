function parseExpression(expression) {
    let operators = ['+', '-', '*', '/'];
    let stack = [];
    let lastOpIndex = -1;
    let lastOp = '';

    for (let i = 0; i < expression.length; i++) {
        let char = expression[i];
        if (char === '(') {
            stack.push(i);
        } else if (char === ')') {
            stack.pop();
        } else if (operators.includes(char) && stack.length === 0) {
            lastOpIndex = i;
            lastOp = char;
        }
    }

    if (lastOpIndex === -1 && expression[0] === '(' && expression[expression.length - 1] === ')') {
        return parseExpression(expression.slice(1, -1).trim());
    }

    if (lastOpIndex !== -1) {
        let left = expression.slice(0, lastOpIndex).trim();
        let right = expression.slice(lastOpIndex + 1).trim();
        
        return {
            operator: lastOp,
            left: parseExpression(left),
            right: parseExpression(right)
        };
    } else {
        return expression.trim();
    }
}

function createNode(value) {
    let node = document.createElement('div');
    node.className = 'node';
    node.textContent = value;
    return node;
}

function buildTree(node, container) {
    if (typeof node === 'string') {
        let leafNode = createNode(node);
        container.appendChild(leafNode);
        return;
    }

    let rootNode = createNode(node.operator);
    container.appendChild(rootNode);

    let line = document.createElement('div');
    line.className = 'line';
    container.appendChild(line);

    let leftRightContainer = document.createElement('div');
    leftRightContainer.style.display = 'flex';
    leftRightContainer.style.justifyContent = 'space-between';

    let leftContainer = document.createElement('div');
    let rightContainer = document.createElement('div');

    leftContainer.className = 'child-container';
    rightContainer.className = 'child-container';

    leftRightContainer.appendChild(leftContainer);
    leftRightContainer.appendChild(rightContainer);

    container.appendChild(leftRightContainer);

    buildTree(node.left, leftContainer);
    buildTree(node.right, rightContainer);
}

function preorder(node) {
    if (typeof node === 'string') {
        return node;
    }
    return `${node.operator} ${preorder(node.left)} ${preorder(node.right)}`.trim();
}

function inorder(node) {
    if (typeof node === 'string') {
        return node;
    }
    return `${inorder(node.left)} ${node.operator} ${inorder(node.right)}`.trim();
}

function postorder(node) {
    if (typeof node === 'string') {
        return node;
    }
    return `${postorder(node.left)} ${postorder(node.right)} ${node.operator}`.trim();
}

document.getElementById('generate-btn').addEventListener('click', () => {
    let expression = document.getElementById('expression-input').value;
    let parsedExpression = parseExpression(expression);
    
    let treeContainer = document.getElementById('tree-container');
    treeContainer.innerHTML = '';
    buildTree(parsedExpression, treeContainer);

    document.getElementById('preorder-output').innerText = `Preorden: ${preorder(parsedExpression)}`;
    document.getElementById('inorder-output').innerText = `Inorden: ${inorder(parsedExpression)}`;
    document.getElementById('postorder-output').innerText = `Posorden: ${postorder(parsedExpression)}`;
});
