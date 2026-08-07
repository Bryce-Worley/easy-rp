const MICROSERVICE_URL = import.meta.env.VITE_UNIT_CONV_URL || 'http://localhost:3001/convert';

interface ConversionRequest {
    value: number;
    from: 'lbs' | 'kg' | 'miles' | 'km' | 'inches' | 'cm' | 'mm' | 'fahrenheit' | 'celsius';
    to: 'lbs' | 'kg' | 'miles' | 'km' | 'inches' | 'cm' | 'mm' | 'fahrenheit' | 'celsius';
}

interface ConversionResponse {
    result: number;
    unit: string;
}

// Sends a conversion request to the microservice and returns the converted value
export async function convertValue(
    value: number,
    from: ConversionRequest['from'],
    to: ConversionRequest['to']
): Promise<number> {
    // If source and target units are the same, return the original value
    if (from === to || value === 0) {
        return value;
    }

    try {
    // Construct the URL with query parameters for a GET request
        const url = new URL(MICROSERVICE_URL);
        url.searchParams.append('value', value.toString());
        url.searchParams.append('from', from);
        url.searchParams.append('to', to);

        const response = await fetch(url.toString(), {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Error converting value: ${response.statusText}`);
        }

        const data: ConversionResponse = await response.json();
        return Math.round(data.result * 100) / 100; // Round to 2 decimal places
    } catch (error) {
        console.error('Error during conversion:', error);
        throw error;
    }
}
