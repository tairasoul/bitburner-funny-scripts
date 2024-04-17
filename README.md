# bitburner-funny-scripts

Simply scripts I use for Bitburner.

Current contents:

- Port registry (src/port-registry/classes/port-registry.ts)
    - This assigns ports and keeps track of which PIDs use which ports (as long as they tell the registry.)
    - Also can assign the first x available ports to a script.

- Multiport class (src/port-registry/classes/multiport.ts)
    - Simply a version of a NetscriptPort that runs with multiple ports.
    - Probably not the best implementation possible, but works for what I use it for.

- Port registry communicator (src/port-registry/classes/communicator.ts)
    - Small abstraction layer for communicating with the port registry and getting it's response to the script's actions.

- Small infection script (src/infect/infect.ts)
    - Infects and gains as much access to all servers it can access, then if you are able to hack it, deploys controller.ts to a server called Controller-Central.