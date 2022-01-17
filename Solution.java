
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.Queue;
import java.util.LinkedList;

public class Solution {

    Map<Integer, Set<Integer>> quickAccess_indexesBySameArrayValue;
    int numberOfPoints;

    public int minJumps(int[] input) {
        numberOfPoints = input.length;

        if (numberOfPoints == 0 || numberOfPoints == 1) {
            return 0;
        }

        if (input[0] == input[numberOfPoints - 1] || numberOfPoints == 2) {
            return 1;
        }

        initialize_quickAccessMap(input);
        return searchForShortestPath(input);
    }

    public int searchForShortestPath(int[] input) {
        Queue<Integer> queueIndexes = new LinkedList<>();
        queueIndexes.add(0);
        boolean[] visited = new boolean[numberOfPoints];
        visited[0] = true;
        int steps = 0;

        while (!queueIndexes.isEmpty()) {

            int level = queueIndexes.size();
            while (level-- > 0) {

                int current = queueIndexes.poll();
                if (current + 1 == numberOfPoints - 1) {
                    return steps + 1;
                }

                if (current - 1 >= 0 && visited[current - 1] == false) {
                    queueIndexes.add(current - 1);
                    visited[current - 1] = true;
                }

                if (current + 1 < numberOfPoints && visited[current + 1] == false) {
                    queueIndexes.add(current + 1);
                    visited[current + 1] = true;
                }

                if (quickAccess_indexesBySameArrayValue.containsKey(input[current])) {
                    Set<Integer> neighbours = quickAccess_indexesBySameArrayValue.get(input[current]);
                    for (int point : neighbours) {
                        if (visited[point] == false) {
                            if (point == numberOfPoints - 1) {
                                return steps + 1;
                            }
                            queueIndexes.add(point);
                            visited[point] = true;
                        }
                    }
                }
                quickAccess_indexesBySameArrayValue.remove(input[current]);

            }
            steps++;
        }
        return steps;
    }

    public void initialize_quickAccessMap(int[] input) {

        quickAccess_indexesBySameArrayValue = new HashMap<>();

        quickAccess_indexesBySameArrayValue.put(input[0], new HashSet<>());
        quickAccess_indexesBySameArrayValue.get(input[0]).add(0);

        quickAccess_indexesBySameArrayValue.put(input[numberOfPoints - 1], new HashSet<>());
        quickAccess_indexesBySameArrayValue.get(input[numberOfPoints - 1]).add(numberOfPoints - 1);

        for (int i = 1; i < numberOfPoints - 1; i++) {
            if (isNotChainOfSameOrAlternatingValues(input[i - 1], input[i], input[i + 1])) {
                quickAccess_indexesBySameArrayValue.computeIfAbsent(input[i], k -> new HashSet<>()).add(i);
            }
        }
    }

    /*
    Avoid including indexes that do not contribute to the shortest path.
    Example, input values: 1, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 8 => case same values.
    Example, input values: 4, 5, 1, 2, 1, 2, 1, 2, 1, 1, 2, 8 => case alternating values.
     */
    public boolean isNotChainOfSameOrAlternatingValues(int left, int center, int right) {
        return (center != left || center != right) && (left != right);
    }
}
