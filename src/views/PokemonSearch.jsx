import React, { useRef, useState } from "react";
import { Box, CircularProgress, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import ToastMsg from "../components/ToastMsg";

const PokemonSearch = ({ setIsTyping }) => {
  const searchValue = useRef(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [pokemonData, setPokemonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPokemonData = async () => {
    try {
      setLoading(true);
      if (!searchValue.current) {
        //show a msg to show
        setErrorMsg("Field is empty");
        return;
      }
      const responseData = await axios
        .get(
          `https://pokeapi.co/api/v2/pokemon/${searchValue.current.toLowerCase()}`
        )
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            setErrorMsg("No data found. Please try again.");
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            setErrorMsg("Failed to get the data. Please try again later");
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("error in request", error.message);
          }
          console.log(error.config);
          setPokemonData(null);
        });
      console.log("responseData", responseData);
      if (responseData.status === 200) {
        setPokemonData({
          name: responseData.data.species.name,
          url: responseData.data.sprites.other["official-artwork"]
            .front_default,
        });
      } else {
        setErrorMsg("Failed to get the data. Please try again later");
      }
    } catch (e) {
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setIsTyping(true);
    searchValue.current = e.target.value;
  };

  const handleKeyDown = (e) => {
    //search using enter key
    if (e.key === "Enter") {
      getPokemonData();
    }
    return;
  };

  return (
    <>
      <ToastMsg
        open={!!errorMsg}
        handleClose={() => setErrorMsg(false)}
        message={errorMsg}
      />
      <Box display="flex" justifyContent="center" alignItems="center" mt={3}>
        <Box mr={1}>Search for your favourite Pokemon :</Box>
        <TextField
          id="outlined-basic"
          placeholder="Seach..."
          variant="outlined"
          onChange={handleInputChange}
          onBlur={() => setIsTyping(false)}
          onClick={() => setIsTyping(true)}
          onKeyDown={handleKeyDown}
          size="small"
        />
        <Box mt={1} ml={2}>
          <SearchIcon sx={{ cursor: "pointer" }} onClick={getPokemonData} />
        </Box>
      </Box>

      {loading ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ height: 200 }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {pokemonData && (
            <Box>
              <Box>Pokemon Name : {pokemonData.name.toUpperCase()}</Box>
              <img
                src={pokemonData.url}
                alt="pokemon"
                width="400px"
                height="400px"
              />
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default PokemonSearch;
