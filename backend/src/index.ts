import { createServer } from './server'
import { config } from './config';

async function main() {
    const app = await createServer()

    app.listen({ port: Number(config.port), host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        console.log(`🚀 Server ready at ${address}`)
    })
}

main()