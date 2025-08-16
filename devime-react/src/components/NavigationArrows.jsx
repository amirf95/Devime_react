import { useNavigate, useLocation } from "react-router-dom";

const steps = ["/estimation-tache0", "/EstimationGrosBetonForm" , "/EstimationSemelles" ];

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
        <div className="flex justify-between bottom-0 left-0 right-0 p-4 bg-white shadow-md z-0 "
        style={{
            display: 'flex',
            justifyContent: 'space-around',
            cursor: 'pointer',
        }}>
            <div className="ml-4">
                <button
                    className="Mybutton"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    Précédent
                </button>
            </div>
            <div className="mr-4">
                <button
                    className="Mybutton"
                    onClick={handleNext}
                    disabled={currentIndex === steps.length - 1}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}