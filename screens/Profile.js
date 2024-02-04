import React, {Component } from 'react';
import {
    Text, 
    View,
    Stylesheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    Switch,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import * as Font from 'expo-font';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

import {getAuth} from 'firebase/auth';
import {ref, update, onValue} from 'firebase/database';
import db from '../config';

let customFonts = {
    'Bubblegum-Sans': requestAnimationFrame('../assets/fonts/BubblgumSans-Regular.ttf'),
};
export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fontsLoaded: false,
            isEnabled: false,
            light_theme: true,
            name: '',
        };
    }

    toggleSwitch() {
        const previous_state = this.state.isEnabled;
        const theme = !thios.state.isEnabled ? 'dark' : 'light';

        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            var updates = {};
            updates ['users/' + user.uid + '/current_theme'] = theme;

            const dbRef = ref(db, '/');
            update( dbRef, updates);

            this.setState({ isEnabled: !previous_state, light_theme: previous_state});

        }
    }

    async _loadFontsAsync() {
        await Font.loadAsync(customFonts);
        this.setState({ fontsLoaded: true});
    }

    componentDidMount() {
        this._loadFontsAysnc();
        this.fetchuser();
    }

    async fetchUser() {
        let theme, name, image;
        const auth = getAuth();
        const userId = auth.currentUser.uid;

        onValue (ref(db, '/users/' + userId), (snapshot) => {
            theme = snapshot.val().current_theme;
            name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
            this.setState({
                light_theme: theme === 'light' ? true : false,
                isEnabled: theme === 'light' ? false : true,
                name: name,
            });
        });
    }

    
}