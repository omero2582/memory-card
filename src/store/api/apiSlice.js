import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import genshin from '../../services/cards/genshin';
import league from '../../services/cards/league';
import playingCards from '../../services/cards/playingCards';

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

  try {
    const deckList = await getGameCards(cardTheme)
    // await preloadImages(deckList.map(c => c.img));
    return { data: deckList }
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
  refetchOnMountOrArgChange: 60, // staleTime
  // I can either enable it here, or speicifcally on every hook call
  // keepUnusedDataFor <- defaults to 60s = time the data will remain in the cache, 
  // after last component referencing it umounts. Also available per endpoint
  reducerPath: 'gameApi',
  // baseQuery: fetchBaseQuery({baseUrl: '/api'}),
  // baseQuery: customBaseQuery,
  tagTypes: ['DeckList', 'LIST'],
  endpoints: (builder) => ({
    getDeckList: builder.query({
      queryFn: myQueryFn,
      async onQueryStarted(arg, {queryFulfilled}){
        //https://redux.js.org/tutorials/essentials/part-8-rtk-query-advanced#the-onquerystarted-lifecycle
        // console.log('ONQUERYSTART')
        const {data} = await queryFulfilled;
        await preloadImages(data.map(c => c.img));
        // console.log('PRELOADED IMAGES', data)
        // TODO - Above code flow will be:
        // queryFN -> run onQueryStarted -> run useEffect on Board.js that runs when
        // the query data changes -> Effect finishes -> our code here finishes
        // Basically: if we want to await the pre-loading as part of our 'fetch',
        // then its better to await preLoadImages inside our queryFn, but If we are ok
        // with the fetch running, then the useEffect running in parallel while preLoasing
        // images, then it is better to run it here
      },
      // only on first cacheEntry per arg
      async onCacheEntryAdded(arg, api) {
        await api.cacheDataLoaded;  // so that cacheEntry will be resolved and have a.data property
        console.log('CACHE ENTRY ADDED',  api.getCacheEntry())
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'DeckList', id })),
              { type: 'DeckList', id: 'LIST' },
            ]
          : [{ type: 'DeckList', id: 'LIST' }],
    })
  })
})

export const { 
  useGetDeckListQuery,
  useLazyGetDeckListQuery
} = apiSlice;

export default apiSlice.reducer;

// For TypeScript usage, the builder.query() and builder.mutation() endpoint definition functions accept two generic arguments: <ReturnType, ArgumentType>. For example, an endpoint to fetch a Pokemon by name might look like getPokemonByName: builder.query<Pokemon, string>(). If a given endpoint takes no arguments, use the void type, like getAllPokemon: builder.query<Pokemon[], void>().