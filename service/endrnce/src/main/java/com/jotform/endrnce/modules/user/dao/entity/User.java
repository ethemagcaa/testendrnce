package com.jotform.endrnce.modules.user.dao.entity;

import com.jotform.endrnce.modules.providertype.dao.entity.ProviderType;
import com.jotform.endrnce.modules.role.dao.entity.Role;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "provider_type_id")
    private Long providerTypeId;

    @Column(name = "provider_id")
    private String providerId;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String email;

    private String password;

    @Column(name = "last_login_date")
    private Date lastLoginDate;

    @Column(name = "last_logout_date")
    private Date lastLogoutDate;

    @Column(name = "created_date")
    private Date createdDate;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="provider_type_id",referencedColumnName = "id", insertable = false, updatable = false)
    private ProviderType providerType;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(	name = "user_role",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Collection<Role> roles = new ArrayList<>();

}
