const Node = (value) => {
    return {
        value,
        left: null,
        right: null
    };
};

const Tree = (array) => {
    return {
        root: buildTree(array),

        includes(value) {
            let currentNode = this.root;

            while (currentNode !== null) {
                if (currentNode.value === value) return true;

                if (currentNode.value > value) {
                    currentNode = currentNode.left;
                } else if (currentNode.value < value) {
                    currentNode = currentNode.right;
                }
            }

            return false;
        },

        insert(value) {
            let currentNode = this.root;
            if (currentNode === null) return;


            while (currentNode !== null) {
                if (currentNode.value === value) return;

                if (currentNode.value > value) {
                    if (currentNode.left === null) {
                        const newNode = Node(value);
                        currentNode.left = newNode;
                        return;
                    } else {
                        currentNode = currentNode.left;
                    }
                } else if (currentNode.value < value) {
                    if (currentNode.right === null) {
                        const newNode = Node(value);
                        currentNode.right = newNode;
                        return;
                    } else {
                        currentNode = currentNode.right;
                    }
                }
            }
        },

        deleteItem(value) {
            let currentNode = this.root;
            let previousNode = null;

            // Search for node
            while (currentNode !== null) {

                // Find node
                if (currentNode.value === value) {

                    if (currentNode.left === null && currentNode.right === null) { // No childs
                        if (previousNode === null) { // Is root?
                            this.root = null;
                            return;

                        } else {
                            if (previousNode.value > value) { // Not root
                                previousNode.left = null;
                                return;
                            } else {
                                previousNode.right = null;
                                return;
                            }
                        }
                    } else if (currentNode.left !== null && currentNode.right !== null) { // 2 child
                        if (previousNode === null) { // Is root

                            let successor = currentNode.right;
                            let successorParent = null;

                            // Find successor and parent
                            while (successor.left !== null) {
                                successorParent = successor;
                                successor = successor.left;
                            }

                            // Direct right child
                            if (successorParent === null) {
                                this.root.value = successor.value;
                                this.root.right = successor.right;
                                return;
                            }

                            // Successor is deeper in the right tree
                            if (successor.right !== null) {
                                successorParent.left = successor.right;
                            } else {
                                successorParent.left = null;
                            }
                            
                            this.root.value = successor.value
                            return;
                        } else { // 2 child, not root

                            let successor = currentNode.right;
                            let successorParent = null;

                            // Find successor and parent
                            while (successor.left !== null) {
                                successorParent = successor;
                                successor = successor.left;
                            }

                            // Successor is direct right child
                            if (successorParent === null) {
                                currentNode.value = successor.value;
                                currentNode.right = successor.right;
                                return;
                            }

                            // Successor is deeper in the right tree
                            currentNode.value = successor.value;

                            if (successor.right !== null) {
                                successorParent.left = successor.right;
                            } else {
                                successorParent.left = null;
                            }

                            return;

                        }
                    } else { // 1 child
                        if (previousNode === null) { // Is root
                            if (currentNode.left !== null) {
                                this.root = currentNode.left;
                            } else {
                                this.root = currentNode.right;
                            }

                        } else { // Not root
                            const child = currentNode.left ?? currentNode.right;

                            if (previousNode.left === currentNode) {
                                previousNode.left = child;
                            } else {
                                previousNode.right = child;
                            }
                        }
                    }

                }

                previousNode = currentNode;

                if (currentNode.value < value) {
                    currentNode = currentNode.right;
                } else {
                    currentNode = currentNode.left;
                }
            }


        },

        levelOrderForEach(callback) {
            if (typeof callback !== "function") throw Error ("callback is not a function");
            if (this.root === null) return null;

            let queue = [];

            queue.push(this.root);

            while (queue.length >= 1) {
                const currentNode = queue.shift();

                callback(currentNode.value);

                if (currentNode.left !== null) {
                    queue.push(currentNode.left);
                }

                if (currentNode.right !== null) {
                    queue.push(currentNode.right);
                }
            }
        },

        inOrderForEach(callback) {
            if (typeof callback !== "function") throw Error ("callback is not a function");

            function traverse(node) {
                if (node === null) return;

                traverse(node.left);
                callback(node.value);
                traverse(node.right);
            }

            traverse(this.root);
        },

        preOrderForEach(callback) {
            if (typeof callback !== "function") throw Error ("callback is not a function");

            function traverse(node) {
                if (node === null) return;

                callback(node.value);
                traverse(node.left);
                traverse(node.right);
            }

            traverse(this.root);
        },

        postOrderForEach(callback) {
            if (typeof callback !== "function") throw Error ("callback is not a function");

            function traverse(node) {
                if (node === null) return;

                traverse(node.left);
                traverse(node.right);
                callback(node.value);
            }

            traverse(this.root);
        },
    }
}

function buildTree(array) {
    array.sort(function(a, b) {
        return (a - b);
    })

    const uniqueValues = new Set(array);
    const sortedArray = [...uniqueValues];

    const root = sortedArrayToBST(sortedArray, 0, (sortedArray.length - 1));

    return root;
}

function sortedArrayToBST(array, start, end) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);

    const root = Node(array[mid])

    root.left = sortedArrayToBST(array, start, (mid - 1));
    root.right = sortedArrayToBST(array, (mid + 1), end);

    return root;
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node === null || node === undefined) {
        return;
    }

    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
}

const tree = Tree([1, 2, 3, 4, 5, 6, 7]);

prettyPrint(tree.root);

tree.levelOrderForEach((value) => {
    console.log(value);
});

console.log("----") 

tree.inOrderForEach((value) => {
    console.log(value);
});