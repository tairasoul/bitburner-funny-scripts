# bitburner-funny-scripts

Simply scripts I use for Bitburner.

Current contents:

- Port registry (src/port-registry/classes/port-registry.ts)
    - This assigns ports and keeps track of which PIDs use which ports (as long as they tell the registry.)
    - Also can assign the first x available ports to a script.
    - Unassigning a port clears its data too.

- Multiport class (src/port-registry/classes/multiport.ts)
    - Simply a version of a NetscriptPort that runs with multiple ports.
    - Probably not the best implementation possible, but works for what I use it for.

- Port registry communicator (src/port-registry/classes/communicator.ts)
    - Small abstraction layer for communicating with the port registry and getting it's response to the script's actions.

- Small infection script (src/infect/infect.ts)
    - Infects and gains as much access to all servers it can access, then if you are able to hack it, deploys controller.ts to a server called Controller-Central.
    - Each controller has its own section of RAM on a server called Controller-Worms, and deploys grow/hack/weaken.ts to said server within it's RAM block.

- Some general utilities
    - locks.ts (src/general/locks.ts) is just an easier way for me to make sure scripts dont overlap eachother.
    - ramnet.ts (src/general/ramnet.ts) is taken from [DarkTechnomancer's github](https://github.com/DarkTechnomancer/darktechnomancer.github.io)
    - remote-file.ts (src/general/remote-file.ts) is just a way to read/write files on a different server than the script is running in.

- .cct solving tomfoolery
    - a lot of the code is taken from [contractor.js.solver.js](https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js)
    - spamSolve.ts spams solve.ts 50 times onto a server called CCT-Crack
    - expect everything to be solved in like, a matter of seconds :3