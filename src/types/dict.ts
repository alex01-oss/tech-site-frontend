export interface ProductCardDict {
    size: string;
    bond: string;
    grid: string;
    fit: string;
    remove: string;
    inCart: string;
    add: string;
    mm: string;
}

export interface CartDict {
    next: string;
    back: string;
    emptyMessage: string;
    emptyField: string;
    placing: string;
    name: string;
    surname: string;
    phone: string;
    email: string;
    address: string;
    deliveryMethod: string;
    standard: string;
    express: string;
    pickup: string;
    payment: string;
    cashOnDelivery: string;
    payNow: string;
    installments: string;
    summary: string;
    total: string;
    itemsPlural: string;
    itemsSingular: string;
    deliveryCost: string;
    agreement: string;
    privacyPolicy: string;
    and: string;
    termsOfService: string;
    cta: string;
    loadingError: string;
}

export interface ProductDetailDict {
    productNotFound: string;
    serverError: string;
    loadError: string;
    loading: string;
    goBack: string;
    unavailable: string;
    code: string;
    keySpecs: string;
    dimensions: string;
    bond: string;
    gridSize: string;
    mounting: string;
    bondDetails: string;
    cooling: string;
    compatibleMachines: string;
    remove: string,
    inCart: string,
    add: string,
    mm: string,
    inch: string,
}

export interface SearchDict {
    filters: any,
    search: {
        search: string,
        filters: string,
        apply: string,
        clearAll: string,
        params: string,
        code: string,
        shape: string,
        dimensions: string,
        machine: string,
        field: any
    }
}

export interface PostDetailDict {
    goBack: string;
    published: string;
}

export interface PostEditorDict {
    loadError: string;
    titleRequired: string;
    contentRequired: string;
    create: string,
    update: string,
    error: string,
    goBack: string,
    unknownError: string,
    title: string,
    image: string,
    changeImage: string,
    pickImage: string,
    previewTitle: string,
    contentEditorTitle: string,
    createPost: string,
    updatePost: string,
}

export interface PostCardDict {
    deletePost: string,
    editPost: string,
    confirm: string,
    text: string,
    irreversible: string,
    cancel: string,
    delete: string,
    deleteSuccess: string,
    deleteError: string,
}

export interface BlogPageDict {
    title: string,
    placeholder: string,
    notFound: string,
    empty: string,
    add: string,
    dialog: any,
}

export interface RegisterPageDict {
    register: {
        title: string,
        fullNameLabel: string,
        emailLabel: string,
        phoneLabel: string,
        passwordLabel: string,
        privacyText: string,
        privacyPolicy: string,
        and: string,
        termsOfUse: string,
        signUpButton: string,
        loading: string,
        success: string,
        registrationFailed: string,
        error: string,
        validation: {
            fullNameRequired: string,
            emailRequired: string,
            emailInvalid: string,
            phoneRequired: string,
            phoneInvalid: string,
            passwordRequired: string,
            passwordMin: string,
            privacyPolicyRequired: string,
        },
    },
    authLayout: any,
}

export interface ProfilePageDict {
    title: string;
    edit: string;
    contactInfo: string;
    activity: string;
    cartItems: string;
    logout: string;
    logoutSuccess: string;
    logoutError: string;
    loginRequired: string;
    email: string;
    phone: string;
}

export interface LoginPageDict {
    login: {
        title: string,
        signInButton: string,
        loading: string,
        emailLabel: string,
        passwordLabel: string,
        success: string,
        invalidCredentials: string,
        error: string,
        validation: {
            emailRequired: string,
            emailInvalid: string,
            passwordRequired: string
        },
    },
    authLayout: any
}

export interface EditProfilePageDict {
    title: string,
    personalInfoTitle: string,
    fullNameLabel: string,
    emailLabel: string,
    phoneLabel: string,
    changePasswordTitle: string,
    currentPasswordLabel: string,
    newPasswordLabel: string,
    confirmNewPasswordLabel: string,
    updateProfileButton: string,
    accountManagementTitle: string,
    logoutAllDevicesButton: string,
    deleteAccountButton: string,
    confirmDeletionTitle: string,
    confirmDeletionText: string,
    cancelButton: string,
    deleteButton: string,
    loginRequired: string,
    success: string,
    noChanges: string,
    updateError: string,
    unexpectedError: string,
    accountDeleted: string,
    deleteAccountFailed: string,
    logoutAllSuccess: string,
    logoutAllFailed: string,
    validation: {
        currentPasswordRequired: string,
        newPasswordSame: string,
        passwordsMatch: string,
        confirmPasswordRequired: string
    }
}

export interface ErrorBoundaryDict {
    errorTitle: string;
    reloadButton: string;
}

export interface AuthLayoutDict {
    haveAccount: string;
    noAccount: string;
    signUp: string;
    signIn: string;
}

export interface NavbarDict {
    authRequired: string,
    login: string,
    lightMode: string,
    darkMode: string,
    language: string,
    settings: string,
    cart: string,
    profile: string,
    logo: string,
    goBack: string,
}

export interface LayoutDict {
    layout: {
        navbar: any,
        footer: any,
    }
    errorBoundary: any
}

export interface FooterDict {
    tagline: string,
    companyName: string,
    copyright: string,
}

export interface VideosSectionDict {
    title: string,
    empty: string,
}

export interface CategoriesSectionDict {
    title: string,
    loadError: string,
}

export interface BlogSectionDict {
    dialog: any,
    blogSection: {
        title: string,
        empty: string,
        viewAll: string,
    }
}

export interface AboutUsDict {
    title: string,
    content: string,
}

export interface CartPageDict {
    cart: CartDict,
    productCard: ProductCardDict
}

export interface CatalogPageDict {
    productCard: any,
    catalog: {
        emptyState: {
            noItemsFound: string,
            startTyping: string,
        },
        controls: {
            filters: any,
            search: any,
        }
    },
    titles: {
        "Grinding Wheels": string,
        "Hybrid bounded wheels": string,
    }
}

export interface FiltersPanelDict {
    filters: string,
    apply: string,
    error: string,
    mm: string,
    titles: Record<string, string>
}