import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  MainTabs: undefined;
  EntryDetail: { entryId: string };
  EntryEditor: { entryId?: string };
};

export type MainTabParamList = {
  TimelineTab: undefined;
  InsightsTab: undefined;
  VaultTab: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type EntryDetailRouteProp = RouteProp<RootStackParamList, 'EntryDetail'>;
export type EntryEditorRouteProp = RouteProp<RootStackParamList, 'EntryEditor'>;

