---
layout: post
title: Dijkstra's Algorithm
date: 2017-03-10 08:30
tag:
- Dijkstra's Algorithm
- Greedy Algorithms
category: blog
author: tony
description: An explanation of Dijkstra's shortest path algorithm and greedy algorithms. 

---

*This is a reformatting and extension of a study guide I made for Washington University CSE 247 students last semester.*

# Shortest Path Algorithms: Dijkstra's Algorithm

Dijkstra’s algorithm is a [greedy algorithm](https://en.wikipedia.org/wiki/Greedy_algorithm) used to calculate the shortest path from a single source to any give node on a weighted, directed graph G = (V, E) where V are vertexes and E are edges. 
[Yes, vertexes is a word.](https://en.wikipedia.org/wiki/Vertex_(geometry))

*A greedy algorithm is an algorithm that follows the pattern of making the locally optimal choice at each stage or iteration with the end goal being a global optimum.* 

In the context of Dijkstra’s algorithm, the above means that at every node (or vertex) the algorithm looks for the *best* route (edge) to take possible. Best in this case is defined as the one with the shortest "distance", or weight. 

## Algorithm Summary and Pseudocode
From the [Cormen et al "Introduction to Algorithms" textbook](https://www.amazon.com/Introduction-Algorithms-3rd-MIT-Press/dp/0262033844), 

> Dijkstra’s algorithm maintains a set S of vertices whose final shortest-path weights from the source s have already been determined. The algorithm repeatedly selects the vertex u in the set V - S with the minimum shortest-path estimate, adds u to set S, and relaxes all edges leaving u ... We use a min-priority queue Q of vertices, keyed by their d values.

The animation located [here](https://upload.wikimedia.org/wikipedia/commons/5/57/Dijkstra_Animation.gif) may help visualize the process.
The pseudocode from "Introduction to Algorithms" is as follows: 

![Dijkstra's Algorithm Pseudocode](http://tonydelanuez.com/assets/blog/3/Dijkstra.png "Pseudocode")

While the queue is not empty, extract the min from the queue and store it in a temporary variable *u*. *u* is added to the set of visited vertexes *S*, then for each vertex *v* adjacent to *u*, perform the relax operation. The relax operation calculates the "distance" of a vertex based on its distance from the source and the value of the connecting edges. 

### Quick, Important Aside on Dijkstra's Algorithm and Greedy Algorithms

In the graph used for Dijkstra’s algorithm, **all edge weights are nonnegative**. Greedy algorithms work by recursively making a set of objects from the smallest parts of the algorithm. As we've learned in our studies of recursion, recursive problems are solved by using the solution to smaller versions of the same problem. When we use greedy algorithms, the advantage lies in the ease of solution of the smaller instances of the problem.

### Time Complexity
Dijkstra’s algorithm maintains the min-priority queue we implemented by calling INSERT, EXTRACT-MIN, and DECREASE-KEY (in RELAX). INSERT and EXTRACT-MIN are called once per vertex.
Each vertex is added to set S once and each edge in the adjacency list Ajd[u] observed in the for loop on line 7 of the pseudocode once.

Number of Edges: |E|
Number of Vertices: |V|

Using a simple list-based priority queue, each INSERT and DECREASE-KEY operation takes O(1) time and each EXTRACT-MIN operation takes O(V) time since we must search through the entire array. 

**List-based priority queue implementation runtime: O(V^2 + E) = O(V^2)**

If the graph is sparse, that is E = O(V^2 / lgV) we can use a min-heap implementation. 
Each EXTRACT-MIN operation then takes O(lg V). Time to build min heap is O(V). Each DECREASE-KEY operation takes O(lg V) time and there are still only | E | of those operations.

**Priority Queue with Binary Queue Min-heap implementation run time:  O((V + E)lgV)**
* This simplifies to **O(E lgV)** if all vertexes are reachable from the source. 

**Priority Queue with Fibonacci Heap implementation run time: O(VlgV + E)**

## Altering the Input Graph 

First thing to note: you’re allowed to have negative graphs in Dijkstra’s algorithm, **but you will no longer be guaranteed to find the globally optimal path**. The path you find will be locally optimal rather than globally optimal. **The only time you can guarantee that Dijkstra’s algorithm will return the globally optimal path is when all edge weights are nonnegative.**

For simplicity’s sake, think of the input graph as defined in the summary above. This is a graph G = (V,E). We have vertexes, and edges.

Addressing some questions about changes to the input graph: 

**Q:**
> "Changes to the input graph (what happens if a bridge breaks on a road, for example, what if there is traffic on a street, how can those things be factored into the algorithm to provide shortest (least-time) paths)?” 
    - Dr. Cytron, in preparation for CSE 247 Exam 2. 
    
**A:**
We made a very, very simplistic implementation of Dijkstra’s Algorithm. In our implementation, we basically think of the weight of an edge as just the distance (say, in miles) between the vertexes that the edge connects. In a more clever implementation of this algorithm, we would use many different things to calculate the weight of each edge. Basically we have different resources to keep in mind and we give them each a priority. A few resources to think of:

* Cost (tolls)
* Scenery (who doesn’t love a pretty view) 
* Speed limits
* Freeway
* Distance (miles)
* Traffic
* Broken bridge, impassable terrain, etc.

When factoring these into our weight equation, we’d simply assign a priority value to each of them and include a way to calculate them into our weight. For example, let’s say you care about three things in order of rising significance: scenery, traffic, and distance.

You’d then want to assign priority values to each and make sure that the larger your distance becomes, the higher the weight becomes. But not only this, an increase in distance must yield a higher increase in the weight than an increase in your scenery value.
It would look something like this:

* Distance (miles) = d
* Traffic (1 - 100), 100 being worst traffic = t
* Scenery (1 - 100), 100 being worst possible view = s 
* weight = w

                                w = 10d+7t+2s 

We notice in the above equation that a one mile increase in distance is five times as significant as a one point increase in the quality of the scenery. This way, we’ve properly added priority values to make sure that in order to pick a scenic route over a short one or one with less traffic, it better be like driving along the California coast.

A broken bridge could be simulated by adding in an infinite value to the weight, seeing as you can’t get past a broken bridge (therefore making it an impassable route).

For a better and more in-depth explanation, I direct you to [this](http://stackoverflow.com/questions/6799172/negative-weights-using-dijkstras-algorithm/6799344#6799344) StackOverflow topic. 

The explanation:

"Assume the edges are directed from left to right as in your example,your algorithm will work as follows:
1. First, you set d( A ) to zero and the other distances to infinity.
2. You then expand out node A, setting d( B ) to 1, d( C ) to zero, and d( D )
to 99.
3. Next, you expand out C, with no net changes.
4. You then expand out B, which has no effect.
5. Finally, you expand D, which changes d( B ) to -201.
Notice that at the end of this, though, that d( C ) is still 0, even though the shortest path to C has length -200. Your algorithm thus fails to accurately compute distances in some cases. Moreover, even if you were to store back pointers saying how to get from each node to the start node A, you’d end taking the wrong path back from C to A.”
Fundamentally, because the algorithm is greedy and looks for local minimum, the negative values can end up tricking it. We’re only processing the nodes once, so we don’t recompute the path upon finding the negative value. We also see that the edge A -> C is not needed for the explanation of the negative values, as it would still break. We cannot send changes back through after ”visiting” a node."

![Negative Weight Problem](http://tonydelanuez.com/assets/blog/3/negweights.png "Negative Weight Problem")

A very important note the poster made in the comments:

>   "This is how Dijkstra’s algorithm works. The algorithm does not explore paths, but instead works by processing nodes. Each node is processed exactly once, so as soon as we process the B node and get that its distance is 1, we will never revisit the node B or attempt to update its distance." -StackOverflow user templatetypedef

### Proof of Correctness of Dijkstra's Algorithm
Rather than retyping the correctness proof I suggest looking at page 659 of the Cormen textbook, or if you don’t have the book follow [this](http://www.math.ucsd.edu/~fan/teach/202/notes/04greed.pdf) link.

The proof starts on slide 48 (looking at the bottom corners). It’s not as involved as the one in the book but the ideas are explained well. But seriously, get [the book](https://www.amazon.com/Introduction-Algorithms-3rd-MIT-Press/dp/0262033844). It’s extremely helpful.

___

As always, I hope this has been helpful. If you’d like more resources on the subject or would like clarification, feel free to post a comment below. Thanks for taking the time to read this! 

-Tony


