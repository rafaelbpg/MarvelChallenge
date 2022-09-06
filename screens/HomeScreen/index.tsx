import {ApisauceInstance, create} from 'apisauce';
import * as React from 'react';
import tw from 'twrnc'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {FlatList, Text, View} from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';

type MarvelHeroesListResponse = {
  //TODO: tipar las respuestas de API para listado de héroes
};

type MarvelHeroComicsListResponse = {
  //TODO: tipar las respuestas de API para listado de cómics de un héroe
};

type MarvelResponse = MarvelHeroesListResponse | MarvelHeroComicsListResponse;

type MarvelHeroData = Array<{}>; //TODO tipar los datos de héroes
type MarvelComicData = Array<{}>; //TODO: tipar los datos de cómics
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
  {apiInstance: create({baseURL: 'https://developer.marvel.com'}), results: {}},
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
          const response = await (target as {
            results: {
              [key in string]?: T;
            };
            apiInstance: ApisauceInstance;
          }).apiInstance.get<T>(url);
          const {data} = response;
          if (response.originalError?.response?.status !== 200 || !data) {
            throw new Error('Error fetching data');
          }

          (target as {
            results: {
              [key in string]?: T;
            };
          }).results[url] = data;

          return data;
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

function getAuthQueryStringParams(): {
  apikey: string;
  ts: string;
  hash: string;
} {
  throw new Error('TODO: devolver los parametros de autenticación');
}

function getPaginationQueryStringParams(
  maxResults: number,
  page: number,
): {
  limit: string;
  offset: string;
} {
  throw new Error(
    `TODO: devolver los parametros de paginación para el listado de héroes con ${maxResults} resultados por página y página ${page}`,
  );
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

  const getNavigatableUrl = useCallback((): string => {
    const newUrl = new URL(url);
    Object.entries({
      ...getAuthQueryStringParams(),
      ...getPaginationQueryStringParams(maxResultsPerPage, page),
    }).forEach((param) => {
      newUrl.searchParams.append(param[0], param[1]);
    });
    return newUrl.toString();
  }, [page, state]);

  useEffect(() => {
    if (state.isFetching || !state.url) {
      return;
    }

    setState(
      state.url !== url
        ? {
            isFetching: true,
            url,
          }
        : {
            ...state,
            isFetching: true,
          },
    );

    marvelProxy[getNavigatableUrl()].then((value) => {
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
    <ApiRequestContext.Provider
      value={[
        state,
        {
          /* TODO implementar la acción */
        },
      ]}>
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

function HeroesList() {
  const [state, actions] = useCachedRequests();
  return (
    <View>
      <FlatList
        data={state.data}
        renderItem={() => <Text>TODO</Text>}
        onEndReached={actions.paginate}
      />
    </View>
  );
}

export function ExampleProvidedComponent({url}: {url: string}) {
  return (
    <CachedRequestsProvider maxResultsPerPage={10} url={url}>
      <HeroesList />
    </CachedRequestsProvider>
  );
}

export default function HomeScreen({url}: {url: string}) {
    return (
      <View style={tw`bg-black h-full`}>
        <HeaderComponent />
        <CachedRequestsProvider maxResultsPerPage={10} url={url}>
          <HeroesList />
        </CachedRequestsProvider>
      </View>
    );
  }
  