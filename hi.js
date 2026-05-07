const handleVote = (aspect, type) => {
    setCount((prevCounts) => ({
        ...prevCounts, //copy the whole big object 
        [aspect]: {  //target the specfic aspect 
            ...prevCounts, //copy the existing { up, dpwn } vlaues 
            [type]: prevCounts[aspect][type] + 1 //Overwrite JUST 
        }
    }))
}

