import {usersDetails} from "../../../api/entryPoint";
import api from "../../services/axiosHeader.js";

export const state = {
    users: [],
    usersDetails: [],
    usersDetailsNav: [],
    isLoading: true
}

export const mutations = {
    SET_USERS(state, newValue) {
        state.users = newValue
    },
    SET_USERS_DETAILS(state, newValue) {
        state.usersDetails = newValue
    },
    SET_USERS_DETAILS_NAV(state, newValue) {
        state.usersDetailsNav = newValue
    },
    SET_IS_LOADING(state, payload) {
        state.isLoading = payload
    },
}

export const getters = {
    getUsers(state) {
        return state.users;
    },
    getUsersDetails(state) {
        return state.usersDetails;
    },
    getUsersDetailsNav(state) {
        return state.usersDetailsNav;
    },
    getIsLoading(state) {
        return state.isLoading;
    },
}

export const actions = {
    // List all users
    listUsers({commit}) {
        api.get(usersDetails).then((res) => {
            console.log(res.data, 'test ')
            commit('SET_USERS', res.data);
        }).catch((error) => {
            console.log(error);
        });
    },
    //users details
    usersDetails({commit, state, rootState}, payload) {
        commit('SET_IS_LOADING', true);
        api.get(usersDetails + payload).then((res) => {
            commit('SET_USERS_DETAILS', res.data);
            commit('SET_IS_LOADING', false);
        }).catch((error) => {
            console.log(error);
        });
    },
//nav bar
    usersDetailsNav({commit, state, rootState}, payload) {
        api.get(usersDetails + '/' + payload).then((res) => {
            commit('SET_USERS_DETAILS_NAV', res.data);
        }).catch((error) => {
            console.log(error);
        });
    },
    /* delete User */
    deleteUser({commit}, id) {
        return api.delete(usersDetails + '/' + id);
    },
    /* Activate User */
    activateUser({commit}, id) {
        return api.get(usersDetails + '/' + id + '/activate');
    },
}

