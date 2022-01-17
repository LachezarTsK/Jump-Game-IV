
#include<unordered_map>
#include<vector>
#include <queue>
#include<set>
using namespace std;

class Solution {
public:
    unordered_map<int, set<int>> quickAccess_indexesBySameArrayValue;
    size_t numberOfPoints;

    int minJumps(vector<int>& input) {
        numberOfPoints = input.size();

        if (numberOfPoints == 0 || numberOfPoints == 1) {
            return 0;
        }

        if (input[0] == input[numberOfPoints - 1] || numberOfPoints == 2) {
            return 1;
        }

        initialize_quickAccessMap(input);
        return searchForShortestPath(input);
    }

    int searchForShortestPath(vector<int>& input) {

        queue<int> queueIndexes;
        queueIndexes.push(0);

        vector<bool> visited(numberOfPoints, false);
        visited[0] = true;

        int steps = 0;
        while (!queueIndexes.empty()) {

            int level = queueIndexes.size();
            while (level-- > 0) {

                int current = queueIndexes.front();
                queueIndexes.pop();

                if (current + 1 == numberOfPoints - 1) {
                    return steps + 1;
                }

                if (current - 1 >= 0 && visited[current - 1] == false) {
                    queueIndexes.push(current - 1);
                    visited[current - 1] = true;
                }

                if (current + 1 < numberOfPoints && visited[current + 1] == false) {
                    queueIndexes.push(current + 1);
                    visited[current + 1] = true;
                }

                if (quickAccess_indexesBySameArrayValue.find(input[current]) != quickAccess_indexesBySameArrayValue.end()) {
                    set<int> neighbours = quickAccess_indexesBySameArrayValue[input[current]];
                    for (int point : neighbours) {
                        if (visited[point] == false) {
                            if (point == numberOfPoints - 1) {
                                return steps + 1;
                            }
                            queueIndexes.push(point);
                            visited[point] = true;
                        }
                    }
                }
                quickAccess_indexesBySameArrayValue.erase(input[current]);

            }
            steps++;
        }
        return steps;
    }

    void initialize_quickAccessMap(vector<int>& input) {

        quickAccess_indexesBySameArrayValue[input[0]] = set<int>();
        quickAccess_indexesBySameArrayValue[input[0]].insert(0);

        quickAccess_indexesBySameArrayValue[input[numberOfPoints - 1]] = set<int>();
        quickAccess_indexesBySameArrayValue[input[numberOfPoints - 1]].insert(numberOfPoints - 1);

        for (int i = 1; i < numberOfPoints - 1; i++) {
            if (isNotChainOfSameOrAlternatingValues(input[i - 1], input[i], input[i + 1])) {
                if (quickAccess_indexesBySameArrayValue.find(input[i]) == quickAccess_indexesBySameArrayValue.end()) {
                    quickAccess_indexesBySameArrayValue[input[i]] = set<int>();
                }
                quickAccess_indexesBySameArrayValue[input[i]].insert(i);
            }
        }
    }

    /*
    Avoid including indexes that do not contribute to the shortest path.
    Example, input values: 1, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8 => case same values.
    Example, input values: 4, 5, 1, 2, 1, 2, 1, 2, 1, 1, 2, 8 => case alternating values.
     */
    bool isNotChainOfSameOrAlternatingValues(int left, int center, int right) {
        return (center != left || center != right) && (left != right);
    }
};
