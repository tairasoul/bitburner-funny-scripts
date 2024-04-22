# bitburner-funny-scripts

Simply scripts I use for Bitburner.

Current contents:

- Casino cheat script (src/rouletteburn-automated)
    - Automates the usage of [rouletteburn](https://github.com/paulcdejean/rouletteburn), simulating trusted clicks.
    - Stops rouletteburn, moves you back to the terminal and stops itself once you reach the profit limit.

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
    - Each controller has its own section of ram, retrieved from the RamNet service.
    - The worms, grow/hack/weaken, are deployed to servers within that section of ram.
    - Has 3 flags.
    - --runhome (bool) tells it if it can run hack/grow/weaken on home. Defaults to false.
    - --moneyCap (number) tells it how much the server's max money should be, at minimum. Defaults to 150 mil.
    - --deployServer (string) tells it where to deploy the controllers to. Defaults to Controller-Central.

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
