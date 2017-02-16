---
layout: post
title: Recursion, Recursion, Recursion. A Primer on Recursive Runtimes.
date: 2017-02-15 22:42
tag:
- Recursion
- Solving Recurrences
- Master Method
- Asymptotic Complexity
category: blog
author: tony
description: An explanation of recursion, recursive runtimes, and how to solve recurrence equations using substitution, recursion trees, and two forms of the master method. 

---

Before I start I'll point out that a lot of the material I cover here comes from one of my favorite resources on recurrences, listed [here](http://www.radford.edu/~nokie/classes/360/recurrence.eqns.revised.html). 

Now let's do some math! But first, explanations. 


->![alt text](http://tonydelanuez.com/assets/blog/2/Sierpinski.png "Sierpinski's Triangle")<-


## What is a recurrence? 
From [Wikipedia](https://en.wikipedia.org/wiki/Recurrence_relation), 
> A recurrence relation is an equation that recursively defines a sequence or multidimensional array of valus, once one or more initial terms are given: each further term of the sequence or array is defined as a function of the preceding terms. 

In computer science, we like to use recurrence relations to explain the mechanics of a *recursive* function. A recursive function has a solution that depends on solutions to smaller instances of the same problem. This means we call the function in itself. Think of calculating [Fibonacci numbers](https://www.mathsisfun.com/numbers/fibonacci-sequence.html): 

> public int fibonacci (int n){ 
if (n <= 1) { 
return 1; 
} 
else { 
return fibonacci(n-1) + fibonacci(n-2); 
} 
} 

The function computes the value of *fibonacci(n)* based on the values returned from *fibonacci(n-1)* and *fibonacci(n-2)*. Interesting, right? How does it get those values? **Base cases**. The base cases tell the function where the recursion stops (for this example, if n is 1 or 0). 

> fibonacci(0) = 1
> fibonacci(1) = 1

When discussing recurrences, we seek to describe the function in terms of its **subproblems** and **work** at each stage. 

The Fibonacci number calculation works on two subproblems, one of size *(n-1)* and the other of size *(n-2)* and simply returns the sum of the results of those subproblems. 

For the rest of this post I'll describe the recurrence as *T(n)*, which is the time complexity of the algorithm based on an input of size *n*. 

## Performance of Non-Recursive Programs 
Let's take a look at some **iterative** programs, as opposed to **recursive** programs. 
### Example 1: 
for(int i = 0; i < n; i++){
counter++;
}

**Performance:**
T(n) = Θ(n)

This is what we call a non-recursive routine. The program above takes a number n, and increments the counter n times. The operation performed inside of the loop is trivial, it does not add any significant terms to the time complexity. 

### Example 2: 
for(int i = 0; i < n; i++){
for(int j = 0; j < n; j++){
counter++;
}
}

**Performance:**
T(n) = Θ(n^2)

There is now a nested loop. Looking at the outer loop, we can tell from the values of i (0, 1, 2, ... , n) that it iterates n times. 
Looking at the inner loop: j assumes values (0, 1, 2, ..., n) as well, meaning it also iterates n times. 
Since the inner loop acts INSIDE of the outer loop, we will MULTIPLY the iterations of each loop because for EACH iteration of the outer loop,
the inner loop must complete its entire iteration. Therefore, the counter will be incremented O(n^2) times. 

### Pondering Point: 
If we add another for loop INSIDE the inner loop (j loop) that has the iteration (for(int k = 0; k < n ;k++)), what will the time complexity of the loop be? 
Answer: Θ(n^3)

For more information on nested loops, look at this handout from [Harvard University](http://isites.harvard.edu/fs/docs/icb.topic600780.files/loop_analysis.pdf). 


## Performance of Recursive Programs 
A recurrence defines *T(n)*, the time complexity of the algorithm/program in terms of T for smaller inputs (think n/2, or n-1). 

### Examples of Recurrences: 
Example of Recurrences: 
> T(n) = 2(T(n/2))

> T(n) = T(n-1) + 6

Explanation of Divide-and-Conquer Relations ([Credit: Greg Baker, Simon Fraser University](https://www.cs.sfu.ca/~ggbaker/zju/math/recurrence.html))

[Binary Search](https://en.wikipedia.org/wiki/Binary_search_algorithm): takes *O(1)* time in the recursive step, and recurses on half the list. Its running time is *T(n) = T(n/2) + 1*

**Binary Search on n objects: *O(nlogn)***

[Merge Sort](https://en.wikipedia.org/wiki/Merge_sort): takes *O(n)* time in the recursive step, and recurses on both halves of the list. It's running time is *T(n) = 2T(n/2) + n*

**Mergesort on n objects: *O(nlogn)***

## How to Reason Through Reccurences

> T(n) = T(n-1) + 6

This recurrence is telling us that the time to run up to n is equal to the time at *(n-1) + 6*.

We call this a recurrence because each step is calculated based on the results of a step before it. There is a **recurrence relation** between step *T(n)* and *T(n-1)*, if you remember what I explained earlier. 

Further, in this equation, the time taken to go from *T(n-1)* to *T(n)* is the difference between the two: 

> T(n) - T(n-1) = T(n-1) + 6  - T(n-1) 

> = 6

Now back to my Fibonacci Sequence example... 

In order to find the value of T(k) at a particular k, there must be **initial conditions** or a **base case**. 

For example, looking at the Fibonacci Sequence: 
0,1,1,2,3,5,8,13... 

The first terms are 0 and 1, each term after is the sum of the two previous terms. 
We can define the recurrence: 
>F(0) = 0
>F(1) = 1
>F(n) = F(n-1) + F(n-2)     for n >= 2

*F(0)* and *F(1)*  are the initial conditions that we plug in to find any given value. 
We must start at *F(0)* and work our way up to *F(k)* or start at *F(k)* and work our way down using the initial conditions, or we can **solve** the recurrence and evaluate the resulting expression.

*Generally, the initial conditions are the value of the recurrence for the smallest values of n.*
Since many recurrences have multiple solutions, the initial conditions determine which solution applies. 

## Evaluating/Solving a Recurrence: 

### Substituting values (THIS IS NOT THE SUBSTITUTION METHOD): 
*Example 1.*
>	Find the value of T(n) = 2(T(n-1)) + n     for n = 3, IC: T(1) = 4


*Solution:*

>   Start at T(1) (given initial condition)

>   T(1) = 4

>   Solve T(2)

>    T(2) = 2(T(2 - 1)) + 2

>    T(2) = 2(T(1)) + 2 

>    T(2) = 2(4) + 2 

>    T(2) = 10

>    T(3) = 2(T(2)) + 3

>    T(3) = 2(10) + 3

>    T(3) = 23


### Approaches to Solving a Recurrence: 
To solve a recurrence, we must find the **closed form** for it. 
Simply put, a closed form for *T(n)* defines *T(n)* without using *T*. 

Given T(n-1) + 1
Closed form: T(n) = n

Techniques to solve recurrences: 
* Guess and Check 
* Forward Substitution
* Backward Substitution
* Characteristic Equation
* Master Method

### Guess and Check, Forward Substitution 
**Steps:**
1. Look for a pattern
2. Guess
3. Informal Check
4. If closed form satisfies open and IC, informally correct
5. If need to prove formally correct, use induction

Using example:
Step 1.

>	T(n) = T(n-1) + 1, IC T(1) = 2 

>   T(1) = 2

>	T(2) = T(1) + 1 = 2 + 1 = 3

>	T(3) = 3 + 1 = 4

>	T(4) = 4 + 1 = 5

>	T(5) = 5 + 1 = 6


Hopefully you have picked up on the pattern, T(n) = n + 1. This is our guess. (Step 2 Complete)

Step 3.

>	T(n) = T(n-1) + 1 = [(n-1) + 1] + 1, Open form satisfied 

>	= n + 1

>	T(1) = 1 + 1 = 2, IC satisfied (substituted in 1)

In case you are confused about what happened in step 3: 
We are using *T(n) = n + 1*. When we see *T(n-1)* we just substitue *n-1* in for *n*, yielding *(n-1) + 1* for *T(n-1)*, then we add the extra 1 because we are solving for *T(n)*. 


### Solving Recurrences with the Substitution Method 

Make a guess for the form of the solution, prove by induction


Example: *T(n) = 2(T(n/2)) + n*

Because of the n/2, we guess some sort of log function. 
Guess *T(n) <= cnlogn* for some constant c 

This says that *T(n) = O(nlogn)*

Proof: 
>	Base Case: show that our guess holds for some base case

>	Assume it holds for (n/2): 

>	T(n/2) <= c(n/2) log(n/2)

>	Prove it holds for n:

>	T(n) = 2(T(n/2)) + n

>	<= 2(c(n/2)log(n/2)) + n    (by substitution)

>	= cnlog(n/2) + n

>	= cnlogn - cnlog2 + n

>	= cnlogn - cn + n      (since log2 is just a constant)

Example on Binary Search:

**Binary Search**
T(n) = T(n/2) + c

Guess T(n) = Θ(log n)

Verify by substitution T(n) = O(n^2)

>	T(n) <= k n^2 

>	T(n/2) <= k(n/2)^2

>	T(n/2) <= kn^2 /4
    
>	Substituting: 

>	T(n) = T(n/2) + c <= kn^2 /4 + c  <= kn^2 ?    (plugging in T(n/2))

>	kn^2  + 4c <= 4kn^2 ?    (mult by 4)

>	4c <= 3kn^2 ? 	 (subtract kn^2 from each side)

>	Yes. Can choose k = 10c or k = 4/3 c

[More information on substitution from Cornell University](http://www.cs.cornell.edu/courses/cs3110/2014sp/recitations/24/using-the-substitution-and-master-method.html)

Now I'm sorry to have strung you along this far only to tell you there's an easier method. 

## Cookie Cutter Master Method
### Solving recurrences of the form: 

![alt text](http://tonydelanuez.com/assets/blog/2/cookiecutterform.png "Cookie Cutter Master Method Form")


[Source and more at Radford.edu](http://www.radford.edu/~nokie/classes/360/recurrence.eqns.revised.html)


With the Master Method you ask: which term dominates? That is, which term defines the function as n goes to infinity. 

Luckily, the "Cookie Cutter Master Method", as nicely called by the folks at [Radford University](http://www.radford.edu/~nokie/classes/360/recurrence.eqns.revised.html), allows us to easily find the solutions to recurrences that follow the above format. Their solutions are:

### Solutions using the Cookie Cutter Master Method:
![alt text](http://tonydelanuez.com/assets/blog/2/cookiecuttersolutions.png "Cookie Cutter Master Method Solutions")

[Source and more at Radford.edu](http://www.radford.edu/~nokie/classes/360/recurrence.eqns.revised.html)


We can replace "T(n) = " with "T(n) <= " or "T(n) >= " to represent O and Ω performance. 

Example: 

Solve the recurrence below:
> T(n) = 16T(n/4) + 5n^3 

Based on the form from above, we know the following:
a = 16, b = 4, d = 3

Using the solutions given above:
16 < 4 ^ 3, Case 1. 

T(n) = Θ(n^3). 

## The General Master Method: 
### Solving recurrences of the form:
![alt text](http://tonydelanuez.com/assets/blog/2/generalmethodform.png "General Master Method Form")

[Source and more at Radford.edu](http://www.radford.edu/~nokie/classes/360/recurrence.eqns.revised.html)

Notice the f(n) here rather than the Θ(n^d). We apply the general master method when we're given a function for f(n) that is not simply a polynomial representation of n. 

The solutions and conditions for the general master method look very similar to the Cookie Cutter Method. 




![alt text](http://tonydelanuez.com/assets/blog/2/generalmethodsolutions.png "General Master Method Form")

[Source and more at Radford.edu](http://www.radford.edu/~nokie/classes/360/recurrence.eqns.revised.html)



Example 1:

>	T(n) = 2T(n/2) + n 

>	a = 2, b = 2, f(n) = n, log_b(a) = lg 2 = 1

>	Case 2

>	T(n) = Θ(nlgn)

Example 2:

>	T(n) = 8T(n/2) + n

>	a = 8, b=2, f(n) = n, log_b(a) = log_2(8) = 3

>	Case 3

>	T(n) = Θ(n^3)


My suggestion to you: *when you can use the cookie cutter method, use the cookie cutter method.*

If a recurrence cannot be solved using the Master Method (General or Cookie Cutter), you must use recursion trees, substitution method, or another method. Which brings me to recursion trees. 


## Recursion Trees:	
Recursion trees are used to calculate  the amount of work expressed by a recurrence equation.
They are useful for visualizing what happens when a recurrence is iterated and can be a good method of guessing. 

In summary: 
**T(n) = aT(n/b) + g(n)**


We keep track of the problem size, draw the tree, and keep track of work done. 
Each level of the diagram represents a level of iteration of the recurrence. 
For each level, we determine three things: 
* Number of subproblems
* Size of each subproblem
* Total work done 

![alt text](http://tonydelanuez.com/assets/blog/2/recursiontree.png "Recursion Tree")

[Credit: Cornell University](http://www.cs.cornell.edu/courses/cs3110/2012sp/lectures/lec20-master/lec20.html)

We also need to determine how many levels there are in the recursion tree. 
The tree has a vertex representing the initial problem and one representing each problem we need to solve. 

Each non-leaf vertex has "a"(constant from formula) children, or **subproblems**. 
The vertices are divided into levels corresponding to sub problems of the same size, which we write to the left. 

On the right, we write the total amount of work done at that level by an algorithm whose work is described by the recurrence (not including recursive call work).

The bottom level of the tree represents the final stage of iterating the recurrence; this is the **base case**. 

My favorite references for drawing recursion trees: 
1. [Cornell University](http://www.cs.cornell.edu/courses/cs3110/2012sp/lectures/lec20-master/lec20.html)
2. [Dartmouth College](https://math.dartmouth.edu/archive/m19w03/public_html/Section5-1.pdf)

___ 
### References: 
1. [Cornell University CS3110 - Lecture 20: Recursion Trees and the Master Method](http://www.cs.cornell.edu/courses/cs3110/2012sp/lectures/lec20-master/lec20.html)
2.  [Cornell University - Using the Substitution and Master Methods](http://www.cs.cornell.edu/courses/cs3110/2014sp/recitations/24/using-the-substitution-and-master-method.html)
3.  [Dartmouth College Archives - Recursion and Recurrences](https://math.dartmouth.edu/archive/m19w03/public_html/Section5-1.pdf)
4.  [Radford University - Recursive Algorithms and Recurrence Equations](http://www.radford.edu/~nokie/classes/360/recurrence.eqns.revised.html)
5. [Wikipedia - Binary Search Algorithm](https://en.wikipedia.org/wiki/Binary_search_algorithm)
6. [Wikipedia - Logarithm](https://en.wikipedia.org/wiki/Logarithm)
7.  [Wikipedia - Merge Sort](https://en.wikipedia.org/wiki/Merge_sort)

___ 


Hopefully this guide has been helpful to you, if you'd like more resources on the subject or would like clarification, feel free to post a comment below. 

-Tony




