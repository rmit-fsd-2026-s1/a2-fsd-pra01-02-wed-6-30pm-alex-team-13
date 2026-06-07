import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {AppDataSource} from '../data-source';
import {User} from '../entities/User';

const router = Router();

const userRepository = AppDataSource.getRepository(User);

function isStrongPassword(password: string){
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasNumber && hasSymbol && isLongEnough;
}

router.post("/signup", async (req, res) => {
    try{
        const {firstName, lastName, email, password, confirmPassword, role} = req.body;

        if(!firstName || !lastName || !email || !password || !confirmPassword || !role){
            return res.status(400).json({message: "All fields are required"});
        }

        if(role !== "hirer" && role !== "vendor"){
            return res.status(400).json({message: "Role must be hirer or vendor"});
        }

        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }

        if(!isStrongPassword(password)){
            return res.status(400).json({message: "Password must be at least 8 characters and include uppercase, lowercase, a number and a symbol"});
        }

        const existingUser = await userRepository.findOne({where: {email}});

        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        await userRepository.save(user);

        res.status(201).json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

router.post("/signin", async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"});
        }

        const user = await userRepository.findOne({where: {email}});

        if(!user){
            return res.status(401).json({message: "Invalid email or password"});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch){
            return res.status(401).json({message: "Invalid email or password"});
        }

        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

router.get("/profile/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);

        const user = await userRepository.findOne({where: {id}});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            dateJoined: user.dateJoined
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

// this avatar is saved as a base64 string so it can be added/edited and fetched back
router.patch("/profile/:id", async (req, res) => {
    try{
        const id = Number(req.params.id);

        const user = await userRepository.findOne({where: {id}});

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const {phone, avatar} = req.body;

        if(phone !== undefined){
            user.phone = phone;
        }

        if(avatar !== undefined){
            user.avatar = avatar;
        }

        await userRepository.save(user);

        res.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            dateJoined: user.dateJoined
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

export default router;
