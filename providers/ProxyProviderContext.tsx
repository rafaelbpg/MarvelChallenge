import {ApisauceInstance, create} from 'apisauce';
import * as React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {Button, FlatList, Image, Pressable, Text, View} from 'react-native';
import tw from 'twrnc';
import {useNavigation, useRoute} from '@react-navigation/native';
import {retrieveData, storeData} from '../services/storage';

type MarvelHeroesListResponse = {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: MarvelHeroData;
  etag: string;
};

type MarvelHeroComicsListResponse = {
  code: number;
  status: string;
  copyright: string;
  attributionText: string;
  attributionHTML: string;
  data: MarvelComicData;
  etag: string;
};

type MarvelResponse = MarvelHeroesListResponse | MarvelHeroComicsListResponse;
type HeroType = {
  id: number;
  name: string;
  description: string;
  modified: Date;
  resourceURI: string;
  urls: Array<{
    type: string;
    url: string;
  }>;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: MarvelComicData;
  stories: {
    available: number;
    returned: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
      type: string;
    }>;
  };
  events: {
    available: number;
    returned: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
  series: {
    available: number;
    returned: number;
    collectionURI: string;
    items: Array<{
      resourceURI: string;
      name: string;
    }>;
  };
};
type MarvelHeroData = Array<{
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Array<HeroType>;
}>;
type ComicType = {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: Array<{
    id: number;
    digitalId: number;
    title: string;
    issueNumber: number;
    variantDescription: string;
    description: string;
    modified: Date;
    isbn: string;
    upc: string;
    diamondCode: string;
    ean: string;
    issn: string;
    format: string;
    pageCount: number;
    textObjects: Array<{
      type: string;
      language: string;
      text: string;
    }>;
    resourceURI: string;
    urls: Array<{type: string; url: string}>;
    series: {
      resourceURI: string;
      name: string;
    };
    variants: Array<{
      resourceURI: string;
      name: string;
    }>;
    collections: Array<{resourceURI: string; name: string}>;
    collectedIssues: Array<{resourceURI: string; name: string}>;
    dates: Array<{type: string; date: Date}>;
    prices: Array<{type: string; price: number}>;
    thumbnail: {
      path: string;
      extension: string;
    };
    images: Array<{path: string; extension: string}>;
    creators: {
      available: number;
      returned: number;
      collectionURI: string;
      items: Array<{
        resourceURI: string;
        name: string;
        role: string;
      }>;
    };
    characters: {
      available: number;
      returned: number;
      collectionURI: string;
      items: Array<{
        resourceURI: string;
        name: string;
        role: string;
      }>;
    };
    stories: {
      available: number;
      returned: number;
      collectionURI: string;
      items: Array<{
        resourceURI: string;
        name: string;
        type: string;
      }>;
    };
    events: {
      available: number;
      returned: number;
      collectionURI: string;
      items: Array<{
        resourceURI: string;
        name: string;
      }>;
    };
  }>;
};
type MarvelComicData = Array<ComicType>;
type MarvelData = MarvelHeroData | MarvelComicData;

type ContextStateUninitialized = {
  url?: undefined;
  isFetching: false;
  data?: undefined;
};

type ContextStateInitialized = {
  url: string;
  isFetching: false;
  data?: undefined;
};

type ContextStateFetching<T> = {
  url: string;
  isFetching: true;
  data?: T;
};

type ContextStateFetched<T> = {
  url: string;
  isFetching: false;
  data: T;
  apisauceInstance: ApisauceInstance;
};

type ApiRequestContextState<T> =
  | ContextStateUninitialized
  | ContextStateInitialized
  | ContextStateFetching<T>
  | ContextStateFetched<T>;

interface IActions {
  paginate(): void;
}

const initialState = {
  isFetching: false,
};

type Props = {
  url: string;
  maxResultsPerPage: number;
  children: JSX.Element;
};

type ProxyHandler<T, P extends string> = {
  get?(target: T, p: P, receiver: any): any;
  set?(
    target: {results: {[key in P]?: T}},
    p: P,
    value: any,
    receiver: any,
  ): boolean;
};

declare const Proxy: {
  new <T extends object>(
    target: {results: {[key in string]?: T}; apiInstance: ApisauceInstance},
    handler: ProxyHandler<T, string>,
  ): {[key: string]: Promise<T>};
};

const marvelProxy = new Proxy<MarvelResponse>(
  {
    apiInstance: create({baseURL: 'https://gateway.marvel.com:443/v1/public/'}),
    results: {},
  },
  {
    get: function <T extends MarvelResponse>(
      target: {
        results: {
          [key in string]?: T;
        };
      },
      url: string,
    ) {
      const values = target;
      return new Promise<T>(async (resolve, reject) => {
        if (values.results.hasOwnProperty(url)) {
          resolve(values.results[url] as T);
          return;
        }
        try {
          const pathUrl = url.split('?')[0];
          const limit = url.split('limit=')[1].split('&')[0];
          const offset = url.split('offset=')[1].split('/')[0];
          const storeKey = `${pathUrl}limit${limit}offset${offset}`;
          const dataStored = await retrieveData(storeKey);
          let response;
          let data;
          if (!dataStored) {
            console.log("Descargando data nueva")
            response = await (
              target as {
                results: {
                  [key in string]?: T;
                };
                apiInstance: ApisauceInstance;
              }
            ).apiInstance.get<T>(url);
            data = response.data;
            storeData(storeKey, JSON.stringify(data))
          }
          else {
            console.log("Buscando en caché")
            data = JSON.parse(dataStored)
          }
          if (data?.status !== 'Ok') {
            throw new Error('Error fetching data');
          }
          (
            target as {
              results: {
                [key in string]?: T;
              };
            }
          ).results[url] = data;
          resolve(data);
        } catch (e) {
          reject(e);
        }
      });
    },
    set: (target, url: string, value) => {
      target.results[url] = value;
      return true;
    },
  },
);

const ApiRequestContext = createContext<
  [ApiRequestContextState<MarvelData>, IActions]
>([initialState as ContextStateUninitialized, {paginate: () => undefined}]);
type AuthParamsType = {
  apikey: string;
  ts: string;
  hash: string;
};
type QueryStringParamsType = {
  limit: string;
  offset: string;
};

function getAuthQueryStringParams(): AuthParamsType {
  const apikey = 'e6470df55c0bd79b8f0a8d4bddc73a62';
  const ts: string = new Date().getTime().toString();
  const privateKey = '9bc994ff81c9693f0e3c03a7e29fd34abef6e5ec';
  const md5 = require('md5');
  const hash = md5(`${ts}${privateKey}${apikey}`);

  return {
    apikey,
    ts,
    hash,
  };
}

function getPaginationQueryStringParams(
  maxResults: number,
  page: number,
): QueryStringParamsType {
  const limit = maxResults.toString();
  const offset = (page * maxResults).toString();
  return {
    limit,
    offset,
  };
}

export function CachedRequestsProvider({
  children,
  url,
  maxResultsPerPage,
}: Props) {
  const [state, setState] = useState<ApiRequestContextState<MarvelData>>({
    isFetching: false,
    url,
  } as ContextStateInitialized);

  const [page, setPage] = useState(0);
  const paginate = (): void => {
    setPage(page + 1);
  };
  const getNavigatableUrl = useCallback((): string => {
    const newUrl = new URL(url);
    Object.entries({
      ...getAuthQueryStringParams(),
      ...getPaginationQueryStringParams(maxResultsPerPage, page),
    }).forEach((param) => {
      newUrl.searchParams.append(param[0], param[1]);
    });
    return newUrl.toString().replace('/?', '?') + '/';
  }, [page, state]);

  useEffect(() => {
    if (state.isFetching || !state.url) {
      return;
    }
    setState(
      state.url !== url
        ? {
            isFetching: true,
            data: undefined,
            url,
          }
        : {
            ...state,
            isFetching: true,
          },
    );
    marvelProxy[getNavigatableUrl()].then((value) => {
      const newResults = value?.data?.results;
      const oldResults = state?.data?.characters?.data?.results;
      if (newResults && oldResults) {
        const mixedResults = oldResults.concat(newResults);
        value.data.results = mixedResults;
      }
      setState({
        ...state,
        isFetching: false,
        data: {
          ...(state.data ?? {}),
          [url]: value,
        },
      } as ContextStateFetched<MarvelData>);
    });
  }, [page, url]);

  return (
    <ApiRequestContext.Provider value={[state, {paginate}]}>
      {children}
    </ApiRequestContext.Provider>
  );
}

export const useCachedRequests = (): [
  ApiRequestContextState<MarvelData>,
  IActions,
] => {
  return useContext(ApiRequestContext);
};
const Hero: React.FC<HeroType> = (props) => {
  const urlImage =
    `${props.thumbnail.path}.${props.thumbnail.extension}`.replace(
      'http://',
      'https://',
    );
  const paramsForNavigation = {
    id: props.id,
    name: props.name,
    description: props.description,
    urlImage: urlImage,
  };
  const navigation = useNavigation();
  return (
    <View>
      <Pressable
        onPress={() => navigation.navigate('Details', paramsForNavigation)}
        style={{
          alignSelf: 'center',
          marginTop: 20,
          borderStyle: 'solid',
          borderColor: 'white',
          borderWidth: 2,
          padding: 12,
        }}>
        <Text style={tw`text-white text-center text-xl mb-1`}>
          {props.name}
        </Text>
        <Image source={{uri: urlImage}} style={{width: 300, height: 300}} />
        <Text style={tw`text-lg text-white text-center mt-1`}>
          {props.comics.available} comics
        </Text>
      </Pressable>
    </View>
  );
};

function HeroesList() {
  const [state, actions] = useCachedRequests();
  const [heroes, setHeroes] = useState<MarvelData>([]);
  useEffect(() => {
    setHeroes(state?.data?.characters?.data.results);
  }, [state, setHeroes]);

  return (
    <View>
      <Text style={tw`text-white text-4xl text-center mt-5`}>Hero list</Text>
      <FlatList
        data={heroes}
        keyExtractor={(heroe) => heroe.id.toString()}
        renderItem={(heroe: HeroType, index) => <Hero {...heroe.item} />}
        onEndReached={actions.paginate}
      />
    </View>
  );
}

function ExampleProvidedComponent({url}: {url: string}) {
  return (
    <CachedRequestsProvider maxResultsPerPage={10} url={url}>
      <HeroesList />
    </CachedRequestsProvider>
  );
}
const Comic: React.FC<ComicType> = (props) => {
  const urlImage =
    `${props.thumbnail.path}.${props.thumbnail.extension}`.replace(
      'http://',
      'https://',
    );
  return (
    <View>
      <Pressable
        onPress={() => 1}
        style={{
          alignSelf: 'center',
          marginTop: 20,
          borderStyle: 'solid',
          borderColor: 'white',
          borderWidth: 2,
          padding: 12,
          width: 300,
        }}>
        <Text style={tw`text-white text-center text-xl mb-1`}>
          {props.title}
        </Text>
      </Pressable>
    </View>
  );
};
function ComicList() {
  const [state, actions] = useCachedRequests();
  const [comics, setComics] = useState<MarvelData>([]);
  const route = useRoute();
  const {id, name, description, urlImage} = route.params;
  const url = `characters/${id}/comics`;
  useEffect(() => {
    let data;
    data = state.data;
    if (data && data[url] && data[url].data && data[url].data.results) {
      setComics(data[url].data.results);
    }
  }, [state, setComics, url]);

  return (
    <View>
      <Text style={tw`text-white text-4xl text-center mt-5`}>Comic list</Text>
      <FlatList
        data={comics}
        keyExtractor={(comic) => comic.id.toString()}
        renderItem={(comic: HeroType, index) => <Comic {...comic.item} />}
        onEndReached={actions.paginate}
      />
    </View>
  );
}

function ComicListComponent({url}: {url: string}) {
  return (
    <CachedRequestsProvider maxResultsPerPage={10} url={url}>
      <ComicList />
    </CachedRequestsProvider>
  );
}
export {ApiRequestContext, ExampleProvidedComponent, ComicListComponent};
