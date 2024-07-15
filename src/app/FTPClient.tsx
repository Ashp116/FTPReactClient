'use server'
import {AccessOptions, Client, FileType} from 'basic-ftp'

class ftpClient {
    private credentials?: AccessOptions
    private client: Client = new Client()

    constructor(accessOptions?: AccessOptions) {
        this.credentials = accessOptions
    }

    public isVerbose() {
        this.client.ftp.verbose = !this.client.ftp.verbose
    }

    public async getCurrentPath() {
        return await this.client.pwd();
    }

    public async cd(path: string) {
        return await this.client.cd(path);
    }

    public async getCurrentContents() {
        const list = await this.client.list()

        console.log(JSON.stringify(list))
    }

    public async connect() {
        try {
            await this.client.access(this.credentials)
        }
        catch(err) {
            console.log(err)
        }
    }

    public disconnect() {
        this.client.close()
    }
}

export const FTPClient = async () => {
    example()

    async function example() {
        const fC = new ftpClient({
            host: "192.168.1.11",
            user: "ftpuser",
            password: "testt",
            secure: false
        })

        await fC.connect()
        await fC.cd("/Kovidh")
        console.log(await fC.getCurrentContents())
    }

    return (
        <></>
    )
};