CREATE TABLE `cucumber_children` (
    `id` bigint(20) NOT NULL,
    `cucumber_feature_id` bigint(20) NOT NULL,
    `name` text NOT NULL,
    `description` text NOT NULL,
    `keyword` varchar(250) NOT NULL,
    `location` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_children2tag` (
    `id` bigint(20) NOT NULL,
    `cucumber_children_id` bigint(20) NOT NULL,
    `cucumber_tag_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_example` (
    `id` bigint(20) NOT NULL,
    `cucumber_children_id` bigint(20) NOT NULL,
    `name` text NOT NULL,
    `description` text NOT NULL,
    `keyword` varchar(250) NOT NULL,
    `location` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_example_table_body` (
    `id` bigint(20) NOT NULL,
    `cucumber_example_id` bigint(20) NOT NULL,
    `location` varchar(250) NOT NULL,
    `cells` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_example_table_header` (
    `id` bigint(20) NOT NULL,
    `cucumber_example_id` bigint(20) NOT NULL,
    `location` varchar(250) NOT NULL,
    `cells` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_feature` (
    `id` bigint(20) NOT NULL,
    `name` text NOT NULL,
    `description` text NOT NULL,
    `keyword` varchar(250) NOT NULL,
    `language` varchar(10) NOT NULL,
    `location` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_feature2tag` (
    `id` bigint(20) NOT NULL,
    `cucumber_feature_id` bigint(20) NOT NULL,
    `cucumber_tag_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_steps` (
    `id` bigint(20) NOT NULL,
    `cucumber_children_id` bigint(20) NOT NULL,
    `text` text NOT NULL,
    `keyword` varchar(250) NOT NULL,
    `keyword_type` varchar(250) NOT NULL,
    `location` varchar(250) NOT NULL,
    `data_table` text,
    `doc_string` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_tag` (
    `id` bigint(20) NOT NULL,
    `name` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `cucumber_history` (
    `id` bigint(20) NOT NULL,
    `adding_date` date NOT NULL,
    `feature_count` int(11) NOT NULL,
    `test_case_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

ALTER TABLE `cucumber_children`
    ADD PRIMARY KEY (`id`),
    ADD KEY `cucumber_feature_id` (`cucumber_feature_id`);

ALTER TABLE `cucumber_children2tag`
    ADD PRIMARY KEY (`id`),
    ADD KEY `cucumber_feature_id` (`cucumber_children_id`),
    ADD KEY `cucumber_tag_id` (`cucumber_tag_id`);

ALTER TABLE `cucumber_example`
    ADD PRIMARY KEY (`id`),
    ADD KEY `cucumber_children_id` (`cucumber_children_id`);

ALTER TABLE `cucumber_example_table_body`
    ADD PRIMARY KEY (`id`),
    ADD KEY `cucumber_example_id` (`cucumber_example_id`);

ALTER TABLE `cucumber_example_table_header`
    ADD PRIMARY KEY (`id`),
    ADD KEY `cucumber_example_id` (`cucumber_example_id`);

ALTER TABLE `cucumber_feature`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `cucumber_feature2tag`
    ADD PRIMARY KEY (`id`),
    ADD KEY `cucumber_feature_id` (`cucumber_feature_id`),
    ADD KEY `cucumber_tag_id` (`cucumber_tag_id`);

ALTER TABLE `cucumber_steps`
    ADD PRIMARY KEY (`id`),
    ADD KEY `cucumber_children_id` (`cucumber_children_id`);

ALTER TABLE `cucumber_tag`
    ADD PRIMARY KEY (`id`);

ALTER TABLE `cucumber_history`
    ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

ALTER TABLE `cucumber_children`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_children2tag`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_example`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_example_table_body`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_example_table_header`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_feature`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_feature2tag`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_steps`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_tag`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE `cucumber_history`
    MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

ALTER TABLE `cucumber_children`
    ADD CONSTRAINT `cucumber_children_ibfk_1` FOREIGN KEY (`cucumber_feature_id`) REFERENCES `cucumber_feature` (`id`);

ALTER TABLE `cucumber_children2tag`
    ADD CONSTRAINT `cucumber_children2tag_ibfk_1` FOREIGN KEY (`cucumber_children_id`) REFERENCES `cucumber_children` (`id`),
    ADD CONSTRAINT `cucumber_children2tag_ibfk_2` FOREIGN KEY (`cucumber_tag_id`) REFERENCES `cucumber_tag` (`id`);

ALTER TABLE `cucumber_example`
    ADD CONSTRAINT `cucumber_example_ibfk_1` FOREIGN KEY (`cucumber_children_id`) REFERENCES `cucumber_children` (`id`);

ALTER TABLE `cucumber_example_table_body`
    ADD CONSTRAINT `cucumber_example_table_body_ibfk_1` FOREIGN KEY (`cucumber_example_id`) REFERENCES `cucumber_example` (`id`);

ALTER TABLE `cucumber_example_table_header`
    ADD CONSTRAINT `cucumber_example_table_header_ibfk_1` FOREIGN KEY (`cucumber_example_id`) REFERENCES `cucumber_example` (`id`);

ALTER TABLE `cucumber_feature2tag`
    ADD CONSTRAINT `cucumber_feature2tag_ibfk_1` FOREIGN KEY (`cucumber_feature_id`) REFERENCES `cucumber_feature` (`id`),
    ADD CONSTRAINT `cucumber_feature2tag_ibfk_2` FOREIGN KEY (`cucumber_tag_id`) REFERENCES `cucumber_tag` (`id`);

ALTER TABLE `cucumber_steps`
    ADD CONSTRAINT `cucumber_steps_ibfk_1` FOREIGN KEY (`cucumber_children_id`) REFERENCES `cucumber_children` (`id`);
