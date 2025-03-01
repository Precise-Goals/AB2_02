// import Together from "together-ai";

// const together = new Together({
//   apiKey: import.meta.env.VITE_TOGETHER_API_KEY, // Use the correct variable name
// });

// export const generateAiSuggestions = async (
//   setAiSuggestions,
//   setShowSuggestions
// ) => {
//   try {
//     const response = await together.text.generate({
//       model: "meta-llama/Llama-3-8b",
//       prompt: "Provide five UX/UI improvement suggestions for a web design.",
//       max_tokens: 100,
//       temperature: 0.7,
//       n: 1,
//     });

//     if (response?.data?.text) {
//       const suggestions = response.data.text
//         .split("\n")
//         .map((s) => s.trim())
//         .filter((s) => s.length > 0);

    
//       setAiSuggestions(suggestions);
//       setShowSuggestions(true);
//     }
//   } catch (error) {
//     console.error("Error generating AI suggestions:", error);
//     console.log("API Key:", import.meta.env.VITE_TOGETHER_API_KEY); // Ensure the API key is being loaded
//   }
// };
