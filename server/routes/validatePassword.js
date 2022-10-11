import { Router } from "express";

const router = Router()

router.post('/url/:id/authorize', async (req, res) => {
    console.log(req.body);


    return res.status(200).json({ message: 'Image uploaded successfully' })
}
);

export { router }