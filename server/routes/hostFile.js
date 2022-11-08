import { Router } from "express";
import http from "http";

const router = Router()

router.put('/url/new/:id', async (req, res) => {
    const { id } = req.params;
    const {password }= req.body;
    
    
    
    console.log(id,password)
    return res.status(200).json({ message: 'Image uploaded successfully' })
}
);

export { router }