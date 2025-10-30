import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- API Endpoint ---
const FEE_API_URL = 'https://2kbbumlxz3.execute-api.us-east-1.amazonaws.com/default/fee';

// --- Type Definitions (For clarity, if using TypeScript, these would be types) ---
// interface FeeItem {
//   Service: string;
//   Fee: string;
//   Description: string;
// }
// interface FeeCategory {
//   [categoryName: string]: FeeItem[];
// }
// interface FeeData {
//   Customer: FeeCategory;
//   Business: FeeCategory;
// }

/**
 * 💡 Helper component to render a single Fee Card.
 * @param {object} props - The component props.
 * @param {string} props.title - The title of the fee category (e.g., 'US Virtual Bank Account').
 * @param {Array<object>} props.fees - The list of services, fees, and descriptions.
 */
const FeeCard = ({ title, fees }) => (
    <div className="fee-card-design-placeholder p-4 border rounded-lg shadow-sm bg-white mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-2">
            {fees.map((item, index) => (
                <li key={index} className="text-sm text-gray-700">
                    <div className="flex justify-between items-start">
                        <span className="font-medium">{item.Service}</span>
                        <span className="font-bold text-indigo-600 ml-4">{item.Fee}</span>
                    </div>
                    {/* Tiny text for description */}
                    {item.Description && (
                        <p className="text-xs text-gray-500 mt-0.5 ml-4 italic">
                            {item.Description}
                        </p>
                    )}
                </li>
            ))}
        </ul>
    </div>
);

/**
 * 💡 The main component for the Fees section.
 */
const FeesComponent = () => {
    // State to hold the fetched data
    const [feeData, setFeeData] = useState(null); 
    // State for loading status
    const [isLoading, setIsLoading] = useState(true);
    // State for error status
    const [error, setError] = useState(null);
    // State to manage the active tab ('Customer' or 'Business')
    const [activeTab, setActiveTab] = useState('Customer');

    // useEffect hook to fetch data on component mount
    useEffect(() => {
        const fetchFees = async () => {
            try {
                const response = await axios.get(FEE_API_URL);
                // Set the entire API response data
                setFeeData(response.data); 
            } catch (err) {
                console.error("Failed to fetch fee data:", err);
                setError("Failed to load fees. Please try again later.");
            } finally {
                // Ensure loading state is turned off regardless of success/failure
                setIsLoading(false); 
            }
        };

        fetchFees();
    }, []); // Empty dependency array ensures it runs only once on mount

    // --- Conditional Rendering for UX ---

    if (isLoading) {
        return (
            <div className="p-8 text-center text-lg text-indigo-600">
                <p>Loading current service and transaction fees...</p>
                {/*  */}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center text-red-600 border border-red-300 bg-red-50 rounded-lg">
                <p>**Error:** {error}</p>
                <p>We could not retrieve the fee data.</p>
            </div>
        );
    }

    if (!feeData) {
         return (
            <div className="p-8 text-center text-gray-500">
                <p>No fee data available at this time.</p>
            </div>
        );
    }
    
    // Select the data relevant to the active tab
    const currentFees = feeData[activeTab];
    // Get the keys (category titles) from the current fees object
    const feeCategories = Object.keys(currentFees);


    return (
        <div className="fees-section-container p-6">
            <h2 className="text-2xl font-bold mb-6">Current Service & Transaction Fees</h2>

            {/* --- Tab Navigation --- */}
            <div className="flex border-b mb-6">
                {['Customer', 'Business'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-base font-medium transition-colors duration-200 
                            ${activeTab === tab 
                                ? 'border-b-2 border-indigo-600 text-indigo-600' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`
                        }
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* --- Fee Cards Grid/Layout --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feeCategories.map((categoryTitle) => (
                    <FeeCard 
                        key={categoryTitle}
                        title={categoryTitle}
                        fees={currentFees[categoryTitle]}
                    />
                ))}
            </div>

            {/* Fallback for empty categories */}
            {feeCategories.length === 0 && (
                 <div className="p-8 text-center text-gray-500">
                    <p>No fee categories are listed for {activeTab} at this time.</p>
                </div>
            )}
        </div>
    );
};

export default FeesComponent;