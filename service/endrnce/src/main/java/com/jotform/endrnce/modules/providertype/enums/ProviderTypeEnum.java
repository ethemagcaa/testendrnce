package com.jotform.endrnce.modules.providertype.enums;

public enum ProviderTypeEnum {

    ON_SITE(1L, "ON_SITE"),
    GOOGLE(2L, "GOOGLE"),
    GITHUB(3L, "GITHUB"),
    FACEBOOK(4L, "FACEBOOK");

    private Long id;
    private String name;

    ProviderTypeEnum(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public static ProviderTypeEnum getById(Long id) {
        if(id != null && id.longValue() != 0) {
            for(ProviderTypeEnum userProviderTypeEnum : ProviderTypeEnum.values()) {
                if(userProviderTypeEnum.getId().equals(id)) {
                    return userProviderTypeEnum;
                }
            }
        }
        return null;
    }

    public static ProviderTypeEnum getByName(String name) {
        for (ProviderTypeEnum userProviderTypeEnum : ProviderTypeEnum.values()) {
            if (userProviderTypeEnum.getName().equalsIgnoreCase(name)) {
                return userProviderTypeEnum;
            }
        }
        return null;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

}
