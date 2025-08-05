// SurveyNavigator.jsx
import { useNavigate, useLocation } from "react-router-dom";
import "./NavigationArrows.css"

const steps = ["/estimation-tache0", "/estimation-tache1", "/estimation-tache2"];

export default function SurveyNavigator() {
    const navigate = useNavigate();
    const location = useLocation();

    const currentIndex = steps.indexOf(location.pathname);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            navigate(steps[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (currentIndex < steps.length - 1) {
            navigate(steps[currentIndex + 1]);
        }
    };

    return (
        <div className="buttons-container">
            <div className="previous-button-container">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    Previous
                </button>
                <div/>
                <div className="next-button-container">
                    <button
                        onClick={handleNext}
                        disabled={currentIndex === steps.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );

}