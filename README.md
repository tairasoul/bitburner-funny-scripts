# bitburner-funny-scripts

Simply scripts I use for Bitburner.

Current contents:

- Port registry (src/services/port-registry.ts)
    - This assigns ports and keeps track of which PIDs use which ports (as long as they tell the registry.)
    - Also can assign the first x available ports to a script.
    - Unassigning a port clears its data too.
    - Communicator is located at src/service-communicators/port-registry.ts


- Ramnet service (src/service/ramnet-service.ts)
    - A more global variant of the RamNet class, functioning as a seperate script and talking with other scripts through ports.
    - Communicator is located at src/service-communicators/ramnet.ts

- Multiport class (src/general/multiport.ts)
    - Simply a version of a NetscriptPort that runs with multiple ports.
    - Probably not the best implementation possible, but works for what I use it for.

- Small infection script (src/infect/infect.ts)
    - Infects and gains as much access to all servers it can access, then if you are able to hack it, deploys controller.ts to a server called Controller-Central.
    - Each controller has its own section of RAM on a server called Controller-Worms, and deploys grow/hack/weaken.ts to said server within it's RAM block.

- Some general utilities
    - locks.ts (src/general/locks.ts) is just an easier way for me to make sure scripts dont overlap eachother.
    - ramnet.ts (src/general/ramnet.ts) is taken from [DarkTechnomancer's github](https://github.com/DarkTechnomancer/darktechnomancer.github.io)
    - remote-file.ts (src/general/remote-file.ts) is just a way to read/write files on a different server than the script is running in.
    - logs.ts (src/general/logs.ts) Just a simple way to have a logfile for a script's entire runtime.

- .cct solving tomfoolery
    - a lot of the code is taken from [contractor.js.solver.js](https://github.com/alainbryden/bitburner-scripts/blob/main/Tasks/contractor.js.solver.js)
    - spamSolve.ts spams solve.ts 50 times onto a server called CCT-Crack
    - expect everything to be solved in like, a matter of seconds :3

- small github cloner
    - clones a github repository
    - first argument is the repository link, second is the sub-directory to clone from, third is the branch
    - auth is grabbed from git-config/auth.txt

## todo

Use the ramnet service to rewrite controller.ts to deploy as many of the same script to target a server, and wait for an equal amount of responses from said scripts.
    - Done but freezes the game cause 4000 scripts are deployed
    - maybe i should fix that lmao
    - they're all 1 thread so i should adapt it to assign a job, then finish it and assign one with the amount of RAM used if we max out the threads for that one
