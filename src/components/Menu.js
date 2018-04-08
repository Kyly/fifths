import { DrawerNavigator } from 'react-navigation';
import CircleOfFifthsScreen from './CircleOfFifthsScreen';
import { ReferencesContainer } from './References';
import { CompositionContainer } from './Composition';

const RootDrawer = DrawerNavigator({
  Home: {
    screen: CircleOfFifthsScreen,
  },
  References: {
    screen: ReferencesContainer,
  },
  Compose: {
    screen: CompositionContainer,
  },
});

export default RootDrawer;
