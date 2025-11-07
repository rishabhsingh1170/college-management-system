import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { addBook, getFines, getBooks, markFinePaid} from "../controller/AdminLibrary.js";

const router = express.Router();

router.post("/books", authenticateToken, requireAdmin, addBook);
router.get("/books", authenticateToken, requireAdmin, getBooks);
router.get("/fines", authenticateToken, requireAdmin, getFines);


router.patch("/fines/:borrower_id/pay", authenticateToken, requireAdmin, markFinePaid);




export default router;
