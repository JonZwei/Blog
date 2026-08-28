import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string,
    currentUserName: string,
}

export function readConfig(): Config {
    const data = fs.readFileSync(getConfigFilePath(),{encoding:'utf8'})
    return validateConfig(JSON.parse(data));
}    

function getConfigFilePath(): string {
    return path.join(os.homedir(), '.gatorconfig.json');
}

export function writeConfig(cfg: Config): void {
    const writeCfg = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName
    }
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(writeCfg));
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig.db_url === 'string') {
        return {
            dbUrl: rawConfig.db_url,
            currentUserName: rawConfig.current_user_name ?? ""
        };
    } else {
        throw new Error("Not a Config");
    }
}