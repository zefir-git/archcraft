import { open, access, constants } from "node:fs/promises";
import Logger from "./Logger.js";


export interface Config {
    /**
     * Port to listen on 
    */
    port: number;

    /**
     * The level to display logs at
     */
    logLevel: Logger.Level;

    /**
     * Kick reason for when the server is shutting down
     */
    shutdownKickReason: string;
}

export class ConfigLoader {
    /**
     * Get a Config instance from a json file
     * @param file The file to read from
     * @returns a promise that resolves to a Config instance
     */
    public static async fromFile(file: string): Promise<Config> {
        let config: Config = ConfigLoader.getDefault();

        if (!(await ConfigLoader.exists(file))) {
            new Logger("Config", config.logLevel).warn("Config does not exist, creating default '%s'", file);
            await ConfigLoader.createDefault(file);
            return config;
        }

        try {
            const fd = await open(file, "r");
            const data = await fd.readFile("utf-8");
            config = JSON.parse(data) as Config;
            fd.close();
            return config;
        } catch (e) {
            new Logger("Config", config.logLevel).error("Failed to read config '%s': %s", file, e);
            process.exit(1); //TODO: better exit handling
        }
        return config;
    }

    /**
     * Get a default config instance
     * @returns a default config instance
     */
    public static getDefault(): Config {
        return  {
            port: 25565,
            logLevel: Logger.Level.INFO,
            shutdownKickReason: "Server closed"
        };

    }

    /**
     * Checks if a config exists
     * @param file The file to check
     * @returns a promise that resolves to a boolean
     */
    public static async exists(file: string): Promise<boolean> {
        try {
            await access(file, constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Create the default config file
     */
    public static async createDefault(file: string): Promise<void> {
        const fd = await open(file, "w");
        await fd.writeFile(JSON.stringify(ConfigLoader.getDefault(), null, 4));
        fd.close();
    }
}

