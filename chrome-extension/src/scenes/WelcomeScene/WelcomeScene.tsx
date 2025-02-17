import { Button } from "@heroui/react";
import { useNavigate } from 'react-router-dom'

export default function WelcomeScene() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col mt-40 ">
            <h1 className="text-center">Welcome to <span className="text-primary">MultiCV</span></h1>
            <p className="text-center">Create unique CVs for unique job offers.</p>
            <div className="flex justify-center gap-2 mt-2">
                <Button onPress={() => navigate("login")} color="primary">Login</Button>
                <Button onPress={() => navigate("register")} color="secondary">Register</Button>
            </div>
        </div>
    )
}
