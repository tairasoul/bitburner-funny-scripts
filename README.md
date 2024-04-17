# bitburner-funny-scripts

Simply scripts I use for Bitburner.

Current contents:

- Port registry (src/classes/port-registry.ts)
    This assigns ports and keeps track of which PIDs use which ports (as long as they tell the registry.)
    Also can assign the first x available ports to a script.

- Multiport class (src/classes/multiport.ts)
    Simply a version of a NetscriptPort that runs with multiple ports.
    Probably not the best implementation possible, but works for what I use it for.

- Port registry communicator (src/classes/communicator.ts)
    Small abstraction layer for communicating with the port registry and getting it's response to the script's actions.
