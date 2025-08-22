export interface ProductCardDict {
    size: string;
    bond: string;
    grid: string;
    fit: string;
    remove: string;
    inCart: string;
    add: string;
    mm: string;
    viewProduct: string;
    imageAlt: string;
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
    loadingProduct: string,
    productImageAltText: string
}

export interface SearchFieldDict {
    enter: string,
    loading: string,
}

export interface SearchDict {
    filters: FiltersPanelDict,
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
        close: string,
        field: SearchFieldDict
    }
}

export interface PostDetailDict {
    goBack: string;
    published: string;
    loadingPost: string;
    notFound: string;
    failedToLoad: string;
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
    loading: string,
    saving: string,
    clearImage: string,
    uploadImageDescription: string,
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
    deletingProcessLabel: string,
}

export interface BlogPageDict {
    title: string,
    placeholder: string,
    notFound: string,
    empty: string,
    add: string,
    searchLabel: string,
    clearSearchLabel: string,
    dialog: any,
}

export interface AuthLayoutDict {
    haveAccount: string;
    noAccount: string;
    signUp: string;
    signIn: string;
    authFormLabel: string;
}

export interface FormWrapperDict {
    authLayout: AuthLayoutDict,
    loadingLabel: string,
}

export interface PasswordFieldDict {
    showPassword: string;
    hidePassword: string;
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
    formWrapper: FormWrapperDict,
    passwordField: PasswordFieldDict
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
    formWrapper: FormWrapperDict,
    passwordField: PasswordFieldDict
}

export interface ProfilePageDict {
    profile: {
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
    avatar: AvatarDict
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
    deletingProcessLabel: string;
    submittingLabel: string;
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
    cartCount: string,
    loading: string,
}

export interface ToolbarDict {
    navbar: NavbarDict,
    avatar: AvatarDict,
}

export interface LayoutDict {
    layout: {
        skipToMainContent: string,
        footer: FooterDict,
        avatar: AvatarDict,
        navbar: NavbarDict,
    }
    errorBoundary: ErrorBoundaryDict
}

export interface FooterDict {
    tagline: string,
    companyName: string,
    copyright: string,
}

export interface VideosSectionDict {
    title: string,
    empty: string,
    videoCard: VideoCardDict,
}

export interface CategoriesSectionDict {
    title: string,
    loadError: string,
    loadingCategories: string,
    categoryImageAlt: string,
    viewCategory: string,
}

export interface BlogSectionDict {
    dialog: any,
    blogSection: {
        title: string,
        empty: string,
        viewAll: string,
        loadingPosts: string,
    }
}

export interface VideoCardDict {
    playVideo: string,
    videoThumbnail: string,
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
    productCard: ProductCardDict,
    catalog: {
        scrollUp: string,
        loading: string,
        emptyState: {
            noItemsFound: string,
            startTyping: string,
        },
        controls: {
            filters: FiltersPanelDict,
            search: SearchDict,
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
    closeFilters: string,
    loadingFilters: string,
    titles: Record<string, string>
}

export interface AvatarDict {
    profile: string;
    userAvatar: string;
    logIn: string;
}