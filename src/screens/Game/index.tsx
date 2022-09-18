import { useRoute, useNavigation } from '@react-navigation/native';
import { View, Image, TouchableOpacity, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';
import { GameParams } from '../../@types/navigation';
import logoImg from '../../assets/logo-nlw-esports.png';
import { Background } from '../../components/Background';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { DuoMatch } from '../../components/DuoMatch';

import { styles } from './styles';
import { THEME } from '../../theme';
import { Heading } from '../../components/Heading';
import React, { useEffect, useState } from 'react';

export function Game() {
  const navigation = useNavigation();
  const route = useRoute();
  const game = route.params as GameParams;
  const [duos, setDuos] = useState<DuoCardProps[]>([])
  const [discordDuoSelected, setDiscordDuoSelected] = useState('')

  function handleGoBack() {
    navigation.goBack();
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://10.0.0.107:3333/ads/${adsId}/discord`)
    .then(response => response.json())
    .then(data => setDiscordDuoSelected(data.discord))
  }

  useEffect(() => {
    fetch(`http://10.0.0.107:3333/games/${game.id}/ads`)
      .then(response => response.json())
      .then(data => setDuos(data))
  },[]);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo 
                name="chevron-thin-left"
                color={THEME.COLORS.CAPTION_300}
                size={20}
            />
          </TouchableOpacity>

          <Image 
            source={logoImg}
            style={styles.logo}
          />

          <View style={styles.right} />
        </View>

        <Image 
          source={{uri: game.bannerUrl}}
          style={styles.cover}
          resizeMode="cover"
        />

        <Heading
          title={game.title}
          subtitle="Conecte-se e comece a jogar!"
        />

        <FlatList 
          data={duos}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return <DuoCard data={item} onConnect={() => getDiscordUser(item.id)}/>
          }}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[duos.length > 0 ? styles.contentList : styles.emptyListContent]}
          style={styles.containerList}
          horizontal
          ListEmptyComponent={() => {
            return (
              <Text style={styles.emptyListText}>
                Não há anúncios publicados ainda.
              </Text>
            )
          }}
        />

        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord={discordDuoSelected}
          onClose={() => setDiscordDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
  );
}