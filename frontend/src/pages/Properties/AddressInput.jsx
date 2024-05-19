import { useState } from "react";
import { getPlaces } from "../../utils/api";

export default function AutoCompleteInput({setFormData, formData}) {
    const [query, setQuery] = useState(""); 
    const [suggestions, setSuggestions] = useState([]);

    const handleChange = (e) => {
        setQuery(e.target.value);
        handleInputChange(e.target.value);
    } 
    
    const handleInputChange = async (query) => {
        const suggestions = await getPlaces(query);
        setSuggestions(suggestions);
    }
    
    const handleSuggestionClick = (suggestion) => {
        const streetAndNumber = suggestion.text.split(",")[0];
        const latitude = suggestion.center[1];
        const longitude = suggestion.center[0];

        const newData = {
            ...formData,
            streetAndNumber,
            place_name: suggestion.place_name,
            latitude,
            longitude,
        };
        
        suggestion.context.forEach((element) => {
            const identifier = element.id.split(".")[0];
            newData[identifier] = element.text;
        })

        setFormData(newData);
        setQuery(suggestion.place_name);
        setSuggestions([]); 
    }
    
    return (
        <div className="autoCompleteInputContainer">
            <input 
                className="w-full p-2 rounded border border-gray-300"
                type="text" 
                id="address"
                placeholder="Dirección"
                value={query}  
                onChange={handleChange}    
            />
            <ul className="mt-2 bg-white rounded shadow-lg">
                {suggestions?.map((suggestion, index) => (
                    <li 
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                    >
                        {suggestion.place_name}
                    </li>
                ))}
            </ul>
            
        </div>
    )
}