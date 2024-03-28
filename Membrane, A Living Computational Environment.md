On its surface Membrane is a fast, secure TypeScript runtime environment with a built-in data graph that ties together your digital world. It defines a few core primitives that enable you to write small programs with robust capabilities. I believe that its potential is so much greater than that though. I think Membrane will be one of the first living computational systems that will change the way we think about what software is capable of. 

_[Membrane](https://www.membrane.io/) was created and is maintained by [Juan Campa](https://twitter.com/juancampa) who I interviewed on [DevTools.fm Episode 46](https://www.devtools.fm/episode/46)_
## Membrane's Nucleus

Membrane is organized around a few underlying concepts, the first being its graph. The graph consists of `field` nodes that can be read from, `action` nodes that can be invoked, and `event` nodes that can be emitted or subscribed to. These nodes are provided to the graph by a `program` which is a TypeScript application. Each program exposes a "root" node, from which all other fields, actions and events can be reached. You can think of the graph as a collection of trees where the `program` is the root of each tree but the nodes of one tree can be connected to another (I like to think of it as a mycelium network). One `program` can depend on another by pointing to a node or nodes that it wishes to use. It can depend on a whole program by referencing its root, which is just another node. There's also the notion of `timers` which can be invoked by a `program`.
### Exploring an Example

These few concepts enable powerful functionality. There's an example program called [`example-daily-advices`](https://github.com/membrane-io/example-daily-advices/tree/6b45d1f637e337dd1369a70165f93a02bc04a662) which sets a `timer` to trigger an `action` node called `sendAdvice` which uses the `openai` program to generate advice and the `email` program to send the generated output to your email. 

You can, of course, build this same functionality with any other general purpose programming language. How Membrane sets itself apart is by the guarantees it provides. 
#### Guarantees

Your code is safe(r) from supply chain attacks. Membrane programs are executed in a QuickJS WASM runtime which is the same technology figma uses to allow users to [write secure plugins](https://www.figma.com/blog/an-update-on-plugin-security/#a-technology-change). Programs are explicitly granted access to nodes on the graph but can’t otherwise access any content of another program. That means if you used a compromised NPM package in one program, it wouldn’t have access to the underlying platform or the contents from any other program aside from nodes that were granted. 

Your programs are easier to debug. Before membrane executes any side effect (like using a node on the graph, performing an http call, etc) it writes a log entry. That means that everything that touches the outside world will always have an associated log. If you don’t see it in the logs, it didn’t happen. Likewise, Membrane surfaces what’s happening inside the platform to the UI. For instance, if any `timers` exist, you’ll see those timers in the UI alongside how long they have left to run and what they’ll do when they expire. 

To better understand these benefits, it’s helpful to explore how programs work in depth.
### The Program Mental Model

#### Single Program Instance Execution

Membrane programs are always running. That doesn't mean every Membrane program you write is always burning CPU cycles, idling for something to happen. When a `program` is idle it's suspended behind the scenes until something else interacts with its graph nodes. While this sounds a bit similar to the behavior of a lambda function in a serverless environment, it's actually closer to how an [actor](https://www.brianstorti.com/the-actor-model/) behaves in Erlang. In a serverless environment, lambdas are stateless and can horizontally scale dynamically based on demand. In Membrane there's only a single instance of a program running and it processes inputs via a queue (similar to Erlang's inbox concept). This single instance execution model gives rise to interesting behavior like the ability for programs to be _durable_. 
#### Durability

Before a `program` in Membrane suspends, a snapshot of its heap memory is captured and stored. When the `program` resumes, that snapshot is restored. This means that instead of relying on a database for stateful behavior between runs, you can just use a variable in the module scope. 

JavaScript is single threaded so when a program needs to await some asynchronous event, the main thread is suspended and work waiting in the event queue is processed. In a normal JavaScript runtime if you call `await` on a promise that takes an arbitrarily long amount of time to complete (days, weeks, etc) this might cause the program to fail with a timeout. In Membrane, when your code hits an `await`, the program will be suspended and can stay suspended indefinitely without worrying about timing out. When it resumes, the heap it used previously will be restored. 
#### Code Reuse

Code reuse in Membrane doesn't work the same way you may be used to in other environments. In Node and other JavaScript runtime environments there's one program and reuse is performed via importing modules. Each Membrane `program` _can_ import modules but reuse happens inside of Membrane via programs and the graph. That means where you might normally expect `http` to be a library you import, in Membrane it's a running program that exposes nodes to the graph that other programs can then invoke. 
#### Portability

Membrane programs are fundamentally portable. Given that their execution engine is in WASM, a membrane program can technically run in any WASM capable environment. Currently every user has their own environment where multiple programs can be deployed. A user can easily share a program with another user either via Git or an explicit action in the UI which sends a copy of the program from one user to another. An admin feature of Membrane that's not currently exposed to users is the ability to send a running program from one environment to another. This potential is a point I want to focus on.

Imagine having the ability to easily target where you wanted a program to run and being able to move a running program from one environment to another. This gets much more interesting if each environment could expose capabilities unique to it. You could have a membrane environment on your laptop which could be granted access to any hardware or operating system features available to that platform. In this world it's easy to imagine having a Membrane program running on your laptop which uses your mic to record speech, does local speech to text with WhisperAI, and then securely invokes a graph node of the cloud membrane instance to send that transcription as an email to someone. 

The opportunity space for a secure computing platform that integrates with your digital context wherever you may be over a simple, normalized interface is incredibly large.
## Living Software Systems

Anyone paying attention to the LLM / AI agent space is likely already excited about the idea of software systems that can act on arbitrary input. With tools like [LangChain](https://www.langchain.com/), reasoning chains and rich inputs/outputs can be combined to build systems that can act independently to accomplish tasks in an uncertain environment. While these tools are powerful, we still have to build, configure, and deploy these stitched together services _somewhere_. Further I think it's going to take a particular kind of environment to transition from a collection of services that accomplish a task to a system that feels _alive_. I want to posit how Membrane can be the system that invokes that sensation.
### Chained Reasoning

Juan has already made strides to bring a simple reasoning engine to Membrane. There's a program called _smith_ (matrix reference) that uses GPT-4, a reasoning loop, and a clever query of the Membrane graph to take a plain language input, break that down into tasks, figure out which nodes from which programs can be used to accomplish the task, and then go about executing it. He's also built a meta program that can be used to find other programs if the agent isn't able to do it on its own (due to limited context).

His first demo to me was just giving it `Tell Justin I said "hi" on discord` and watching the logs as it broke down the task, found the relevant nodes in the graph, and invoked them (which did result in me getting the message on the first attempt). 

The fact that Membrane has only a few basic concepts drastically increases the ability for agents to successfully operate on arbitrary capabilities added at a later time.

It's also exciting to consider that the reasoning agent itself is just another program in Membrane meaning that it could choose to recurse.
### Self Expanding

An important aspect in the growth of membrane as a product is the ability to easily and quickly create and share programs. There's certainly more work needed in this space. One idea that I'm excited about is a meta program that can be used to create new and control existing programs. This would not only allow the automation of adding capabilities to the system (like the ability to generate a program from an openapi spec) but also give another tool to the reasoning engine to improve itself.

You could imagine the reasoning engine deciding to create a dedicated program to handle some task perhaps on some schedule or in response to an event.
### Evolving Stimuli

As more programs are created on Membrane and more runtime platform targets are added the capabilities available to an agent will continue to expand. The ability to see and hear could be granted by a Membrane node running locally on your laptop paired with OpenAI's vision and STT APIs (via the OpenAI program). 
## Looking Forward

It’s anyone’s guess on how long it’ll take for us to reach AGI. That said, I feel like the future where our software grows and adapts as we interact with it is incredibly close. Platforms like Membrane will provide us the base on which to build these living software systems. I’m incredibly excited for that future.