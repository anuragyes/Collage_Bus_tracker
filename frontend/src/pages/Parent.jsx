import React from "react";
import familyImage from "../assets/for-parents.png"; // Replace with the correct path to your image

const Parent = () => {
    return (
        <>
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

                    {/* Left Image */}
                    <div className="flex justify-center">
                        <img
                            src={familyImage}
                            // src=""
                            alt="Happy family"
                            className="rounded-lg shadow-lg w-full max-w-md object-cover"
                        />
                    </div>

                    {/* Right Content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Benefits <br /> For Parents
                        </h2>
                        <p className="text-gray-600 mb-6">
                            myskoolbus app keeps all the concerned parties in the loop and saves
                            everyone trouble. The benefits of the app are multifold:
                        </p>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                The bus is delayed at any point
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                5 minutes before the bus arrives at the designated point
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                Once the child boards the school bus or if he doesn't
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                Once the child departs the school bus
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                When the bus has reached school
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                When the bus crosses the speed limit
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                If the bus is taking an unusual route
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
                    {/* Right Content */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Benefits <br /> For Parents
                        </h2>
                        <p className="text-gray-600 mb-6">
                            myskoolbus app keeps all the concerned parties in the loop and saves
                            everyone trouble. The benefits of the app are multifold:
                        </p>
                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                The bus is delayed at any point
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                5 minutes before the bus arrives at the designated point
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                Once the child boards the school bus or if he doesn't
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                Once the child departs the school bus
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                When the bus has reached school
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                When the bus crosses the speed limit
                            </li>
                            <li className="flex items-start">
                                <span className="w-3 h-3 mt-2 mr-3 bg-yellow-500 rounded-full"></span>
                                If the bus is taking an unusual route
                            </li>
                        </ul>
                    </div>

                    {/* Left Image */}
                    <div className="flex justify-center">
                        <img
                            src={familyImage}
                            // src=""
                            alt="Happy family"
                            className="rounded-lg shadow-lg w-full max-w-md object-cover"
                        />
                    </div>
                </div>
            </section>

        </>

    );
};

export default Parent;
