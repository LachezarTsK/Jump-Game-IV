
/**
 * @param {number[]} input
 * @return {number}
 */
var minJumps = function (input) {
    const search = new Search(input);
    return search.searchForShortestPath();
};

class Search {
    constructor(input) {
        this.input = input;
        this.quickAccess_indexesBySameArrayValue = new Map();
        this.numberOfPoints = input.length;
    }

    searchForShortestPath() {

        if (this.numberOfPoints === 0 || this.numberOfPoints === 1) {
            return 0;
        }
        if (this.input[0] === this.input[this.numberOfPoints - 1] || this.numberOfPoints === 2) {
            return 1;
        }

        this.initialize_quickAccessMap();

        const queueIndexes = new Queue();
        queueIndexes.enqueue(0);
        const visited = new Array(this.numberOfPoints).fill(false);
        visited[0] = true;

        let steps = 0;
        while (!queueIndexes.isEmpty()) {

            let level = queueIndexes.size();
            while (level-- > 0) {

                let current = queueIndexes.dequeue();
                if (current + 1 === this.numberOfPoints - 1) {
                    return steps + 1;
                }

                if (current - 1 >= 0 && visited[current - 1] === false) {
                    queueIndexes.enqueue(current - 1);
                    visited[current - 1] = true;
                }

                if (current + 1 < this.numberOfPoints && visited[current + 1] === false) {
                    queueIndexes.enqueue(current + 1);
                    visited[current + 1] = true;
                }

                if (this.quickAccess_indexesBySameArrayValue.has(this.input[current])) {
                    const neighbours = this.quickAccess_indexesBySameArrayValue.get(this.input[current]);
                    for (let point of neighbours) {
                        if (visited[point] === false) {
                            if (point === this.numberOfPoints - 1) {
                                return steps + 1;
                            }
                            queueIndexes.enqueue(point);
                            visited[point] = true;
                        }
                    }
                }
                this.quickAccess_indexesBySameArrayValue.delete(this.input[current]);
            }
            steps++;

        }
        return steps;
    }

    initialize_quickAccessMap() {

        this.quickAccess_indexesBySameArrayValue.set(this.input[0], new Set());
        this.quickAccess_indexesBySameArrayValue.get(this.input[0]).add(0);

        this.quickAccess_indexesBySameArrayValue.set(this.input[this.numberOfPoints - 1], new Set());
        this.quickAccess_indexesBySameArrayValue.get(this.input[this.numberOfPoints - 1]).add(this.numberOfPoints - 1);

        for (let i = 1; i < this.numberOfPoints - 1; i++) {
            if (this.isNotChainOfSameOrAlternatingValues(this.input[i - 1], this.input[i], this.input[i + 1])) {
                if (!this.quickAccess_indexesBySameArrayValue.has(this.input[i])) {
                    this.quickAccess_indexesBySameArrayValue.set(this.input[i], new Set());
                }
                this.quickAccess_indexesBySameArrayValue.get(this.input[i]).add(i);
            }
        }
    }

    /*
     Avoid including indexes that do not contribute to the shortest path.
     Example, input values: 1, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8 => case same values.
     Example, input values: 4, 5, 1, 2, 1, 2, 1, 2, 1, 1, 2, 8 => case alternating values.
     */
    isNotChainOfSameOrAlternatingValues(left, center, right) {
        return (center !== left || center !== right) && (left !== right);
    }
}
