import { useRouter } from 'next/router'
import ClientOnly from '../../components/ClientOnly'
import { Autocomplete } from './Autocomplete'
import { geocoderLookup } from '../../js/mapbox/Client'
import { PlaceTemplate, resultItemToUrl } from './CragFinderTemplates'
import { debounced } from '../../js/utils'
import { Feature, Geometry } from 'geojson'

const SEARCH_OPTIONS = {
  country: 'US',
  region: 'poi,place,region'
}
export interface CragFinderProps {
  isMobile?: boolean
  placeholder?: string
}

export default function CragFinder ({ isMobile = true, placeholder = 'Try \'Smith Rock\', \'Las Vegas\'' }: CragFinderProps): JSX.Element {
  const router = useRouter()

  return (
    <Autocomplete
      id={CUSTOM_CLASSES.root}
      isMobile={isMobile}
      classNames={CUSTOM_CLASSES}
      placeholder={isMobile ? '' : placeholder}
      getSources={({ query }) => {
        if ((query).length < 3) {
          return []
        }
        const features: () => Promise<Array<Feature<Geometry, { [name: string]: object }>>> = async () => await geocoderLookup(query, SEARCH_OPTIONS)
        const navigate: ({ itemUrl: string }) => Promise<boolean> = async ({ itemUrl }) => await router.push(itemUrl)
        const itemUrl = ({ item }): string => {
          const { text, center, id }: {text: string, center: [number, number], id: string } = item
          return resultItemToUrl(text, id, center)
        }

        return debounced([{
          sourceId: 'location',
          getItems: features,
          navigator: navigate,
          getItemUrl: itemUrl,
          templates: {
            noResults () {
              return 'No results.'
            },
            item ({ item }) {
              return (
                <ClientOnly>
                  <PlaceTemplate key={item.id} placeName={item.place_name} shortName={item.text} center={item.center} placeId={item.id} router={router} />
                </ClientOnly>
              )
            }
          }
        }
        ])
      }}
    />
  )
}

export function MobileCragFinder (): JSX.Element {
  return (<div>foos</div>)
}

const CUSTOM_CLASSES = {
  root: 'crag-finder',
  item: 'crag-finder-item',
  panelLayout: 'crag-finder-panelLayout'
}
