import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import genshin from '../../services/cards/genshin';
import league from '../../services/cards/league';
import playingCards from '../../services/cards/playingCards';
import { handleNewDeck, setCardTheme } from "../slices/gameSlice";

// // Custom baseQuery to handle user state
// const customBaseQuery = (baseUrl) => {
//   const baseQuery = fetchBaseQuery({ baseUrl });
//   return async (args, api, extraOptions) => {
//     const result = await baseQuery(args, api, extraOptions);
    
//     if(result.data && args.url !== '/products/upload-presigned'){
//       if (result.data) {
//         console.log('Setting user TO', result.data.user)
//         api.dispatch(setUser(result.data.user));
//       }
//     }

//     // return result; // Return the original result
//     return {...result, meta:{...result.meta, test:'hi'}};
//   };
// };

function preloadImages(imageUrls) {
  return Promise.all(
    imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    })
  );
}

const myQueryFn = async ( cardTheme, { dispatch, getState }, extraOptions) => {

  const getGameCards = async (cardTheme) => {
      const themeMap = {
        genshin: genshin,
        league: league.processSummary,
        playingCards: playingCards
      };
    
      const fetchCards = themeMap[cardTheme] || playingCards;
      const out = await fetchCards();
      return out;
    };
  
    const setupGame = async (cardTheme) => {
      const cards = await getGameCards(cardTheme);
      // loading like this always starts out with isClicked: false. No need to call resetCardsClicked() here
      dispatch(setCardTheme(cardTheme))
      dispatch(handleNewDeck(cards))
      await preloadImages(cards.map(c => c.img));
      return cards;
    }

  try {
    const data = await setupGame(cardTheme);
    return { data }
  } catch (error) {
    return { error }
  }
}


// RTK Query note:
// Invalidating queries can only solve the problem of: 'If I performed an action,
// then refetch this other thing.' However, invalidating queries has nothing to do with
// 'When should any user refetch this query, considering other users might change the backend data.'
// That problem can only be solved by things like 'refetchOnMountOrArgChange', or 'keepUnusedDataFor'
// refetchOnMountOrArgChange = staleTime in Tanstack Query
// keepUnusedDataFor = after this unmounts, start counting X seconds. If we remount before X seconds,
// then use the prev cached data, otherwise re-fetch. We almost never want this.

// TODO add option to each query so they can individually opt into
// using mock fetch, apart from our .env variable
// for ex 'query: (body, isUseMock) =>
export const apiSlice = createApi({
  refetchOnMountOrArgChange: 20, // staleTime
  // I can either enable it here, or speicifcally on every hook call
  // keepUnusedDataFor <- defaults to 60s = time the data will remain in the cache, 
  // after last component referencing it umounts. Also available per endpoint
  reducerPath: 'gameApi',
  // baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  // baseQuery: customBaseQuery,
  tagTypes: ['Cards', 'LIST'],
  endpoints: (builder) => ({
    getCards: builder.query({
      queryFn: myQueryFn,
      async onQueryStarted(arg, api){
        // api.queryFulfilled promise
        //https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#the-onquerystarted-lifecycle
      },
      async onCacheEntryAdded(arg, api) {
        await api.cacheDataLoaded;  // so that cacheEntry will be resolved and have a.data property
        console.log('CACHCEHCHECHCHEHCEHEHC',  api.getCacheEntry())
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Cards', id })),
              { type: 'Cards', id: 'LIST' },
            ]
          : [{ type: 'Cards', id: 'LIST' }],
    }),
  })
})

export const { 
  useGetCardsQuery,
  useLazyGetCardsQuery
} = apiSlice;

export default apiSlice.reducer;

// For TypeScript usage, the builder.query() and builder.mutation() endpoint definition functions accept two generic arguments: <ReturnType, ArgumentType>. For example, an endpoint to fetch a Pokemon by name might look like getPokemonByName: builder.query<Pokemon, string>(). If a given endpoint takes no arguments, use the void type, like getAllPokemon: builder.query<Pokemon[], void>().