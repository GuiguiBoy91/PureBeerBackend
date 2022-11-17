// ~ FileSystem
import * as fs from 'fs'
import * as path from 'path'

import { Request } from 'express'

// ~ Upload
import multer from 'multer'

const storage = multer.diskStorage({
  destination: async (
    { baseUrl, params }: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ): Promise<void> => {
    // ~ Use base endpoint as a directory
    const [directory] = baseUrl.split('/').slice(-1)
    const destination = path.join(
      process.env.STORAGE_PATH || '.',
      'uploads',
      directory,
      // ~ Create a directory for each Model records
      (params.id) ? params.id:'',
    )

    console.log('UPLOAD: Destination, ', destination, directory)

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true })
    }

    await fs.promises.chmod(destination, 511)

    callback(null, destination)
  },
  filename(
    request: Request,
    file: Express.Multer.File,
    callback: (error: (Error | null), filename: string) => void,
  ) {
    const extension = path.extname(file.originalname)
    const filename = (file.fieldname === 'file')
      ? file.originalname
      : `${file.fieldname}${extension}`

    callback(null, filename)
  }
})

export const upload = multer({ storage })
export const remove = fs.unlinkSync
